const form = document.getElementById("contactForm");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    spinner.style.display = "inline-block";
    btnText.innerText = "Sending...";

    const data = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };

    try {
        const response = await fetch("/api/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("response").innerText = result.message;

        if (result.success) {
            form.reset();
        }

    } catch (error) {
        document.getElementById("response").innerText =
            "Unable to send your message. Please try again.";
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = "none";
        btnText.innerText = "Send Message";
    }
});
