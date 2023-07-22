document.addEventListener('keypress', keypress_ivent);

function keypress_ivent(e) {
    if (e.key === "Enter") {
        location = "select.html"
        var obj = document.activeElement;
        obj.nextElementSibling.focus();
    }
    return false;
}
