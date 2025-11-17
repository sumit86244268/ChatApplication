const textarea = document.getElementsByClassName('messageInput');

textarea.addEventListener("input",() => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + "px";
})