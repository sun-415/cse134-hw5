document.addEventListener("DOMContentLoaded", function () {
    const form         = document.getElementById("contactForm")
    const nameInput    = document.getElementById("name");
    const emailInput   = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const form_errors = [];
    
    // Allowed character regex for name
    const allowedChars = /^(?=.*[A-Za-z])[A-Za-z\s]*$/;
    
    function showError(input, message){
        const errorOutput = document.getElementById(input.id + "-error");
        errorOutput.textContent = message;
        errorOutput.classList.remove("hidden");
        input.classList.add("flash");

        form_errors.push({
            field: input.id,
            message: message,
            value: input.value
        });
    
        setTimeout(() => {
            errorOutput.classList.add("hidden");
            input.classList.remove("flash");
        }, 2000);
    }
    
    // Masking input for Name and Comments
    function enforceCharacterRules(event){
        if(!allowedChars.test(event.target.value)){
            showError(event.target, "Invalid character entered.");
            event.target.value = event.target.value.replace(/[^A-Za-z\s]/g, "");
        }
    }

    // Using setCustomValidity() to only allow submission of gmail users
    function enforceGmail(){
        // Validate with the built-in constraints
        emailInput.setCustomValidity("");
        if (!emailInput.checkValidity() && !emailInput.validity.valueMissing) {
            showError(emailInput, "Please use @gmail.com address only.");
            return;
        }

        // Extend with a custom constraints
        if (!emailInput.value.endsWith("@gmail.com")) {
            showError(emailInput, "Please use @gmail.com address only.");
            emailInput.setCustomValidity("Please enter an email address of @gmail.com");
        }   
    }

    /* Not reaching the min or max text length for subject and message field is not an error */
    function enforceTextLength(input){
        let max = input.maxLength;
        let length = input.value.length;
        let charsLeft = max - length;

        const infoOutput = document.getElementById(input.id + "-info");

        // Always show countdown
        infoOutput.textContent = `${charsLeft} characters remaining.`;

        // Remove previous styles
        infoOutput.classList.remove("len-limit-error-medium", "len-limit-strong");

        // % of the limit used
        let percent = length / max;

        // Apply intensity based on how close they are
        if (percent >= 0.8) {
            infoOutput.classList.add("len-limit-strong");   // red + bold
        } else if (percent >= 0.6) {
            infoOutput.classList.add("len-limit-medium");   // darker + semi-bold
        }

        // Handle actual limit
        if (length >= max) {
            infoOutput.textContent = "Maximum characters reached";
        } 
    }
    
    nameInput.addEventListener("input", enforceCharacterRules);
    emailInput.addEventListener("input", enforceGmail);
    subjectInput.addEventListener("input", () => enforceTextLength(subjectInput));
    messageInput.addEventListener("input", () => enforceTextLength(messageInput));

    form.addEventListener("submit", (event) => {
        if(!form.checkValidity()){
            event.preventDefault();
        }

        const errorsField = document.getElementById("form-errors");
        errorsField.value = JSON.stringify(form_errors);

        // Build mailto link
        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        // Body text for the email
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            message
        ];

        const mailtoHref =
            `mailto:elainesun64@gmail.com` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

        // Open the user's email client
        event.preventDefault();        // prevent POST to httpbin when JS is on
        window.location.href = mailtoHref;
    });

});

