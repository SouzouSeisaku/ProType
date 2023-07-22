document.addEventListener('keyup', keyup_event);

function keyup_event(e) {
    if (e.key === "Escape") {
        location.href = "practice.html";
        var obj = document.activeElement;
        obj.nextElementSibling.focus();
    }
    return false;
}
