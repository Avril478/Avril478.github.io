var index = 0,
    sections = document.getElementsByClassName("section"),
    imgs = document.getElementsByClassName("icon"),
    num = imgs.length,
    productSection = document.getElementById("product-section");
search = productSection.getElementsByTagName("input")[0],
    commentBut = document.getElementById("commentBut"),
    showCom = document.getElementById('showCom'),
    guestName = document.getElementById('guestName'),
    comment = document.getElementById('comment'),
    newsList = document.getElementById('news-list');

function initiation() {
    for (var i = 0; i < num; i++) {
        sections[i].style.display = "none";
    }
    sections[index].style.display = "block";
}

function changeSection() {
    for (var i = 0; i < num; i++) {
        imgs[i].style.background = "white";
        sections[i].style.display = "none";
    }
    imgs[index].style.background = "gray";
    sections[index].style.display = "block";
}


window.onload = function() {
    initiation();
    getProducts();
    displayNews();
    getComments();
    getvcard();
    for (var i = 0; i < num; i++) {
        imgs[i].id = i;
        imgs[i].onclick = function() {
            index = this.id;
            changeSection();
        }
    }
}


let LoginOrNot = ""
Username = ""
Password = ""

const showLoginContainer = () => {
    document.getElementById("login-container").style.display = "block"
    document.getElementById("sign-in-container").style.display = "none"
}
const showSignInContainer = () => {
    document.getElementById("login-container").style.display = "none"
    document.getElementById("sign-in-container").style.display = "block"
}

const Login = () => {
    const xhr = new XMLHttpRequest();
    const uri = "http://localhost:8189/Service.svc/user"
    const user = document.getElementById("loginName").value
    const passwd = document.getElementById("LoginPassword").value
    xhr.open("GET", uri, true, user, passwd);
    xhr.withCredentials = true;
    xhr.onload = () => {
        if (xhr.status == 200) {
            LoginOrNot = "login"
            Username = user
            Password = passwd
            window.alert("Welcome " + user)
            document.getElementById("UserloginName").innerHTML = user;
            document.getElementById("UserloginName").style.display = "inline"
            document.getElementById("logOut").style.display = "inline"
            document.getElementById("loginName").value = null
            document.getElementById("LoginPassword").value = null
            imgs[5].style.background = "white";
            sections[5].style.display = "none";
            imgs[0].style.background = "gray";
            sections[0].style.display = "block";

        } else {
            window.alert("Incorrect username or password.")
        }
    }
    xhr.send(null);
}

const logOut = () => {
    LoginOrNot = ""
    Username = ""
    Password = ""
    document.getElementById("UserloginName").style.display = "none"
    document.getElementById("logOut").style.display = "none"
}


const register = () => {
    const form = document.getElementById("register")
    form.addEventListener('submit', Register);
}

const postRegister = (data) => {
    return fetch('http://localhost:8188/DairyService.svc/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
};

const Register = (e) => {
    e.preventDefault();

    let n = JSON.stringify(document.getElementById("registerName").value)
    let p = JSON.stringify(document.getElementById("registerPsd").value)
    let a = JSON.stringify(document.getElementById("registerAds").value)
    const data = '{"Address":' + a + ', "Name":' + n + ', "Password":' + p + ' }'
    postRegister(data)
        .then(res => res.json())
        .then(response => {
            if (response.includes("registered")) {
                window.alert(response)
                document.getElementById("registerResponse").innerHTML = ""
                document.getElementById("registerName").value = null
                document.getElementById("registerPsd").value = null
                document.getElementById("registerAds").value = null
                showLoginContainer()

            } else {
                document.getElementById("registerResponse").innerHTML = response
            }
        })
}

const Buy = (id) => {
    if (LoginOrNot == "login") {
        let uri = "http://localhost:8189/Service.svc/buy?id=" + id;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", uri, true, Username, Password);
        xhr.withCredentials = true;
        xhr.onload = () => {
            if (xhr.status == 200) {
                const responseText = xhr.responseText.substring(xhr.responseText.indexOf('">') + 2, xhr.responseText.indexOf('</'));
                window.alert(responseText)
            }

        }
        xhr.send(null);

    } else {
        window.alert("Please log in")
        imgs[1].style.background = "white";
        sections[1].style.display = "none";
        imgs[5].style.background = "gray";
        sections[5].style.display = "block";
    }
}











function getProducts() {
    const fetchPromise = fetch('http://localhost:8188/DairyService.svc/items', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => displayProducts(data));
}

function displayProducts(data) {
    const tab = document.getElementById("products-list");
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += getImg(data, i) + getTitle(data, i) +
            getDetail(data, i);
    }
    tab.innerHTML = html;
}

function getImg(data, i) {
    var src = "http://localhost:8188/DairyService.svc/itemimg?id=" + data[i].ItemId;
    var html = "";
    html += "<div style='padding: 20px 0 15px'>"
    var img = new Image();
    img.src = src;
    html += "<img src='" + img.src + "' max-width=55% height=250px>";
    html += "</div>";
    return html;
}


function getTitle(data, i) {
    var html = "";
    html += "<p style='clear: both; padding-top: 20px'>";
    var description = data[i].Title;
    html += description + "</p>";
    return html;
}


function getDetail(data, i) {
    var html = "";
    html += "<div style='height: 70px;>"
    html += "<p style='font-size: 16px; color: gray;>";
    html += 'Country:' + data[i].Origin + "<hr>";
    html += 'Type: ' + data[i].Type + "<hr>";
    html += 'Price: ' + data[i].Price;
    html += "</p>" + "</div>";
    html += "<button style='height:28px;width:100px;font-size:20px; border:1px solid black;' type=‘button’ onclick='Buy(" + data[i].ItemId + ")'>Buy now</button>"
    return html;
}

search.oninput = function() {
    var content = search.value.trim();
    var uri = "http://localhost:8188/DairyService.svc/search?term=" + content;
    const fetchPromise = fetch(uri, {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => displayProducts(data));
}

function displayNews() {
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => showNews(data));
}

function showNews(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        html += getImage(data, i) + getImageDetails(data, i) +
            getDesciptionField(data, i);
    }
    newsList.innerHTML = html;
}

function getImage(data, i) {
    var html = "";

    html += "<div style='padding: 20px 0 15px' class='news-image-div'>"
    var img = new Image();
    img.src = data[i].enclosureField.urlField;
    html += "<img src='" + img.src + "' max-width=55% height=400px>";
    html += "</div>";
    return html;
}

function getImageDetails(data, i) {
    var html = "";
    html += "<p style='font-size: 16px; color: gray; float: left; width: 50%'>";
    html += "<a href=" + data[i].linkField + ">";
    html += data[i].titleField;
    html += "</a>";
    html += "<p style='font-size: 16px; color: gray; float: right; width: 50%'>";
    html += data[i].pubDateField + "</p>";
    html += "</p>";
    return html;
}

function getDesciptionField(data, i) {
    console.log("hi");
    var html = "";
    html += "<p style='clear: both; padding-top: 20px'>";
    var descriptionField = data[i].descriptionField;
    html += descriptionField + "</p>"
    return html;
}

function getComments() {
    const fetchPromise = fetch('http://localhost:8188/DairyService.svc/htmlcomments', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => showCom.innerHTML = data);
}

commentBut.onclick = function() {
    const uri = "http://localhost:8188/DairyService.svc/comment?name=" + guestName.value;
    const fetchPromise = fetch(uri, {
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        method: "POST",
        body: JSON.stringify(comment.value)
    }).then(response => { getComments() });
    comment.value = '';
    guestName.value = '';
}

function getvcard() {
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.text());
}