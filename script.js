const form = document.getElementById("contactForm");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const submitBtn = document.getElementById("submitBtn");
const response = document.getElementById("response");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    spinner.style.display = "inline-block";
    btnText.textContent = "Sending...";

    emailjs.sendForm(
        "service_tbjfywq",
        "template_vb7mbpt",
        this
    ).then(() => {

        response.textContent = "Message sent successfully!";
        form.reset();

    }).catch(() => {

        response.textContent = "Failed to send message.";

    }).finally(() => {

        submitBtn.disabled = false;
        spinner.style.display = "none";
        btnText.textContent = "Send Message";

    });
});
