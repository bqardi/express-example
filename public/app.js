const postUser = document.querySelector("[data-post");

postUser.addEventListener("click", async e => {
	const response = await fetch("/api/users", {
		method: "POST",
		credentials: "same-origin",
		headers: {
      "Content-Type": "application/json"
    },
		body: JSON.stringify({"name": "John Doe", "email": "john@doe.com"})
	});
	const data = await response.json();
	const dialog = document.querySelector("[data-toast]");
	dialog.querySelector("[data-toast-message]").textContent = `New entry added to database with ID: ${data.id}`;
	dialog.show();
	setTimeout(() => {
		dialog.close();
	}, 3000);
});