const events = [

{
    name: "Concert",
    date: "21 Nov 2026",
    city: "Paris",
    image: ""
},

{
    name: "Festival",
    date: "5 Dec 2026",
    city: "Berlin",
    image: ""
},

{
    name: "Theatre",
    date: "14 Dec 2026",
    city: "Milan",
    image: ""
}

];

function renderEvents() {
        const container = document.getElementById("eventsContainer");
        container.innerHTML = "";
        events.forEach((event) => {
            container.innerHTML += `
            <div class="col-md-4">
            <div class="card h-100 shadow-sm">
            <img src="${event.image}" class="card-img-top">
            <div class="card-body">
            <h5 class="card-title">${event.name}</h5>
            <p class="card-text text-muted">
            ${event.city} · ${event.date}
            </p>
            <button class="btn btn-warning"
            onclick="buyTicket('${event.name}','${event.date}')">
            Buy ticket
            </button>
            </div>
            </div>
            </div>
            `;
        });
}


function buyTicket(eventName, eventDate) {
    if (localStorage.getItem("auth") !== "true") {
    alert("Please login to buy tickets");
    window.location.href = "login.html";
    return;
}
    const user = JSON.parse(localStorage.getItem("user"));
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    tickets.push({
    event: eventName,
    date: eventDate,
    owner: user.email
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));

    alert("Ticket purchased!");

}

renderEvents();