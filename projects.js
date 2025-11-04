// Simple projects data - easy to customize!
const projects = [
  {
    title: "Project One",
    description: "A beautiful website built with HTML, CSS, and JavaScript",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#",
  },
  {
    title: "Project Two",
    description: "An interactive web app with Tailwind CSS styling",
    tags: ["JavaScript", "Tailwind", "Web App"],
    link: "#",
  },
  {
    title: "Project Three",
    description: "A responsive portfolio website for a client",
    tags: ["HTML", "CSS", "Responsive"],
    link: "#",
    },


]

// Function to display projects
function displayProjects() {
  const container = document.getElementById("projectsContainer")

  projects.forEach((project) => {
    const projectCard = document.createElement("div")
    projectCard.className = "bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition"

    projectCard.innerHTML = `
            <h4 class="text-xl font-bold mb-2">${project.title}</h4>
            <p class="text-slate-300 mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.tags.map((tag) => `<span class="bg-blue-500 text-white text-xs px-2 py-1 rounded">${tag}</span>`).join("")}
            </div>
            <a href="${project.link}" class="text-blue-400 hover:text-blue-300">View Project →</a>
        `

    container.appendChild(projectCard)
  })
}

// Display projects when page loads
document.addEventListener("DOMContentLoaded", displayProjects)
