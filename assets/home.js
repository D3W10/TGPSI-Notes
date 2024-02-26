var QR, IODBackground = document.createElement("style");
const SidePanel = document.getElementById("sidePanel");
const SPHeights = {"Home": "336px", "Create": "193px", "Open": "339px"};

SidePanel.style.height = SPHeights.Home;

(async function () {
    try {
        var utilsResponse = await fetch("https://tgpsi-utils.herokuapp.com/imageofday");
        var Img = await utilsResponse.json();
        IODBackground.innerHTML = `#main { background-image: url(${Img.URL}); }`;
    } catch (error) {
        console.warn("Usando o fundo pré definido!");
        IODBackground.innerHTML = "#main { background-image: url(./assets/overview.jpg); }";
    }
    document.getElementsByTagName("head")[0].appendChild(IODBackground);
})();


// LISTENERS

document.getElementById("openCreateButton").addEventListener("click", () => {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Create;
        document.getElementById("createPanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("createPanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("openOpenButton").addEventListener("click", () => {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = SPHeights.Open;
        document.getElementById("openPanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("openPanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("footerBackC").addEventListener("click", () => {
    document.getElementById("createPanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("createPanel").style.display = "none";
        SidePanel.style.height = SPHeights.Home;
        document.getElementById("createError").style.visibility = "hidden";
        document.getElementById("homePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("homePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("footerBackA").addEventListener("click", () => {
    document.getElementById("openPanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("openPanel").style.display = "none";
        SidePanel.style.height = SPHeights.Home;
        document.getElementById("homePanel").style.display = "block";
        setTimeout(() => {
            document.getElementById("homePanel").style.opacity = "1";
        }, 400);
    }, 400);
});

document.getElementById("fileName").addEventListener("keyup", (event) => {
    if (document.getElementById("fileName").value.length == 0 || /[\\\/:*\?"<>|]/g.test(document.getElementById("fileName").value)) {
        document.getElementById("filesCreate").disabled = true;
        if (/[\\\/:*\?"<>|]/g.test(document.getElementById("fileName").value)) {
            document.getElementById("createError").innerHTML = "O nome não pode ter: \\ / : * ? \" < > |";
            document.getElementById("createError").style.visibility = "visible";
        }
    }
    else {
        document.getElementById("createError").style.visibility = "hidden";
        document.getElementById("filesCreate").disabled = false;
        if (event.key == "Enter")
            FileCreate();
    }
});

document.getElementById("filesInputBox").addEventListener("click", () => {
    if (!document.getElementById("filesInputBox").hasAttribute("lock")) {
        document.getElementById("filesInput").click();
    }
});

document.getElementById("editorLogo").addEventListener("click", async function () {
    document.getElementById("returnImg").style.visibility = "visible";
    document.getElementById("editor").style.filter = "blur(3px)";
    document.getElementById("flexSide").removeAttribute("style");
    SidePanel.style.padding = "1px";
    await sleep(50);
    SidePanel.removeAttribute("style");
    SidePanel.style.height = "1px";
    await sleep(50);
    SidePanel.style.height = SPHeights.Home;
    document.getElementById("homePanel").style.display = "block";
    setTimeout(() => {
        document.getElementById("homePanel").style.opacity = "1";
    }, 400);
});

document.getElementById("returnImg").addEventListener("click", async function () {
    document.getElementById("homePanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("homePanel").style.display = "none";
        SidePanel.style.height = 0;
        SidePanel.style.padding = 0;
        document.getElementById("editor").style.filter = "none";
    }, 400);
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    if (event.matches) {
        document.getElementById("editorShare").src = "./assets/icons/editor/dark/share.svg";
    }
    else {
        document.getElementById("editorShare").src = "./assets/icons/editor/light/share.svg";
    }
});


// FUNCTIONS

async function FileCreate() {
    var LoadIcon = document.createElement("img");
    LoadIcon.src = "./assets/icons/load.gif";
    LoadIcon.classList.add("sideFooterLoad");
    document.getElementsByClassName("sideFooterBtn")[0].insertBefore(LoadIcon, document.getElementById("filesCreate"));
    var appearance = window.matchMedia("(prefers-color-scheme: dark)");
    if (appearance.matches) {
        document.getElementById("editorShare").src = "./assets/icons/editor/dark/share.svg";
    }
    else {
        document.getElementById("editorShare").src = "./assets/icons/editor/light/share.svg";
    }
    window.onbeforeunload = function (e) {
        e = e || window.event;
        if (e) {
            e.returnValue = "Sure?";
        }
        return "Sure?";
    };
    document.getElementsByClassName("sideFooterBtn")[0].removeChild(LoadIcon);
    document.getElementById("createPanel").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("createPanel").style.display = "none";
        SidePanel.style.height = 0;
        SidePanel.style.padding = 0;
        document.getElementById("editor").style.display = "block";
        setTimeout(() => {
            document.getElementById("flexSide").style.display = "none";
            document.getElementById("editor").style.opacity = "1";
        }, 400);
    }, 400);
}

function CopyToClipboard() {
    var copyText = document.getElementById("outputCode").innerHTML;
    copyText = `https://tgpsi-share.netlify.app/?dl=${copyText}`;
    var TextArea = document.createElement("textarea");
    TextArea.value = copyText;
    document.body.appendChild(TextArea);
    TextArea.select();
    TextArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(TextArea);
    document.getElementById("doneCopy").innerText = "Copiado!";
    setTimeout(() => {
        document.getElementById("doneCopy").innerText = "Copiar Link";
    }, 3000);
}

async function CreateQRCode() {
    var CodeQR = `https://tgpsi-share.netlify.app/?dl=t-${document.getElementById("outputCode").innerHTML}` ;
    new QRious({
        element: document.getElementsByTagName("canvas")[0],
        value: CodeQR,
        backgroundAlpha: 0,
        foreground: "#007aff",
        size: 140
    });
    document.getElementById("doneInfo").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("doneInfo").style.display = "none";
        document.getElementById("footerBackD").onclick = function() { BackDQR(); };
        document.getElementById("doneQR").style.display = "flex";
        setTimeout(() => {
            document.getElementById("doneQR").style.opacity = "1";
        }, 400);
    }, 400);
}

function BackDQR() {
    //  !! !! !!
    document.getElementById("doneQR").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("doneQR").style.display = "none";
        document.getElementById("footerBackD").onclick = function() { BackD(); };
        document.getElementById("doneInfo").style.display = "block";
        setTimeout(() => {
            document.getElementById("doneInfo").style.opacity = "1";
        }, 400);
    }, 400);
}

async function dragAndDrop(event, mode) {
    //  !! !! !!
    event.preventDefault();
    event.stopPropagation();
    if (!document.getElementById("filesInputBox").hasAttribute("lock")) {
        if (mode == "over") {
            document.getElementById("filesChoose").innerText = "Preparado para enviar!";
            document.getElementById("filesDrop").innerText = "Apenas larga-o e eu trato do resto!";
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.getElementById("filesInputBox").style.borderColor = "var(--dark-air-l5)";
            }
            else {
                document.getElementById("filesInputBox").style.borderColor = "var(--light-air-l5)";
            }
        }
        else {
            if (mode == "leave") {
                document.getElementById("filesChoose").innerText = "Escolher ficheiros";
                document.getElementById("filesDrop").innerText = "Ou arraste para aqui!";
                if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.getElementById("filesInputBox").style.borderColor = "var(--dark-air-l3)";
                }
                else {
                    document.getElementById("filesInputBox").style.borderColor = "var(--light-air-l3)";
                }
            }
            else {
                if (mode == "drop") {
                    document.getElementById("filesChoose").innerText = "Escolher ficheiros";
                    document.getElementById("filesDrop").innerText = "Ou arraste para aqui!";
                    colorizeBorder();
                    FilePrepare(event, 1);
                }
            }
        }
    }
}

async function colorizeBorder() {
    var borderColors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE"];
    for (const color of borderColors) {
        document.getElementById("filesInputBox").style.borderColor = color;
        await sleep(200);
    }
    document.getElementById("filesInputBox").removeAttribute("style");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}