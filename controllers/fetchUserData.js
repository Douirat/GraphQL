import { get_JWT } from "../utils/token.js";
import { render_login_form } from "../components/login.js";
import { processUserData } from "./processUserData.js";

function retryFetch(url, options, retries = 3, delay = 1000) {
  return fetch(url, options).catch((err) => {
    if (retries === 0) throw err;
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(retryFetch(url, options, retries - 1, delay)),
        delay
      )
    );
  });
}

export function fetchUserData() {
  console.log("fetchUserData running...");

  const token = get_JWT();
  if (!token) {
    alert("Missing JWT");
    return render_login_form();
  }

  const query = `
    query {
  user {
    login
    firstName
    lastName
    email
    campus
    auditRatio
    totalUp
    totalDown
    transactions(
      where: {
        _and: [
          { type: { _eq: "level" } },
          { eventId: { _eq: 41 } }
        ]
      }
      order_by: { amount: desc }
      limit: 1
    ) {
      amount
    }
    xps(
      where: { originEventId: { _eq: 41 } }
      order_by: { amount: asc }
    ) {
      path
      amount
    }
  }

  totalXp: transaction_aggregate(
    where: {
      type: { _eq: "xp" },
      eventId: { _eq: 41 }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
  `;

  setTimeout(() => {
    retryFetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed with status " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("fetchUserData response:", data);
        // - ?. ➜ Optional Chaining for return undefined not error
        const user = data?.data?.user?.[0];
        const totalXp = data?.data?.totalXp?.aggregate?.sum?.amount || 0;

        if (!user) {
          console.warn("No user data found");
          return render_login_form();
        }
        console.log("User data fetched");
        processUserData(user, totalXp);
      })
      .catch((err) => {
        console.error("fetchUserData error:", err.message);

        if (
          //problem in server or network
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError")
        ) {
          alert("Server unreachable. Try again later.");
          return;
        }

        // Error not related to network → clear token and redirect
        localStorage.clear();
        render_login_form();
      });
  }, 200); // Delay to avoid spam
}
