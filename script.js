// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn")
const mobileMenu = document.getElementById("mobileMenu")

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden")
})

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll("a")
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden")
  })
})

// Contact form handling with Formspree
const contactForm = document.getElementById("contactForm")
const formMessage = document.getElementById("formMessage")

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(contactForm)

  try {
    // Send to Formspree
      const response = await fetch("https://formspree.io/f/mrbopjyq", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    if (response.ok) {
      formMessage.textContent = "Message sent successfully!"
      formMessage.className = "text-center text-sm text-green-400"
      contactForm.reset()

      // Clear message after 3 seconds
      setTimeout(() => {
        formMessage.textContent = ""
      }, 3000)
    } else {
      formMessage.textContent = "Error sending message. Please try again."
      formMessage.className = "text-center text-sm text-red-400"
    }
  } catch (error) {
    formMessage.textContent = "Error sending message. Please try again."
    formMessage.className = "text-center text-sm text-red-400"
  }
})
