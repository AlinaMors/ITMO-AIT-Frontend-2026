// page protection from unauthorized users
if (localStorage.getItem("auth") !== "true") {
    window.location.href = "index.html";
}

// loading a user
const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("userName").textContent = user.name;
document.getElementById("userEmail").textContent = user.email;


// uploading tickets
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

// create a ticket list on the page
function renderTickets() {
    const container = document.getElementById("ticketsList");

    const userTickets = tickets.filter(ticket => ticket.owner === user.email);
    if (userTickets.length === 0) {
        container.innerHTML = `
            <p class="text-muted">You haven't purchased any tickets yet.</p>
        `;
        return;
    }

    container.innerHTML = "";

    userTickets.forEach((ticket, index) => {
        container.innerHTML += `
            <div class="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
                <div>
                    <strong>${ticket.event}</strong><br>
                    <small class="text-muted">${ticket.date}</small>
                </div>

                <button class="btn btn-sm btn-outline-danger"
                        onclick="refundTicket(${index})">
                    Refund
                </button>
            </div>
        `;
    });
}

// ticket refunding
function refundTicket(index) {
    tickets.splice(index, 1);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
}

function logout() {
    localStorage.removeItem("auth");
    window.location.href = "index.html";
}

renderTickets();
