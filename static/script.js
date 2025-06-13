const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">support_agent</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const smoothScrollToBottom = () => {
    // Scroll to the bottom of the chatbox smoothly
    chatbox.scrollTo({
        top: chatbox.scrollHeight,
        behavior: 'smooth'
    });
}

const generateResponse = async (userMessage) => {
    const incomingChatLi = createChatLi(". . .", "incoming");
    incomingChatLi.querySelector("p").id = 'thinking';
    chatbox.appendChild(incomingChatLi);
    smoothScrollToBottom(); // Scroll down after appending the thinking message

    try {
        const response = await fetch(https://henrychat-chcsg5bveah4fpcp.eastus-01.azurewebsites.net/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        incomingChatLi.querySelector("p").innerHTML = data.response;
        incomingChatLi.querySelector("p").id = '';
        smoothScrollToBottom(); // Scroll down after the bot responds
    } catch (error) {
        console.error("Error fetching response from server:", error);
        incomingChatLi.querySelector("p").textContent = "Sorry, I am not sure what you mean, could you clarify?";
        incomingChatLi.querySelector("p").id = '';
        smoothScrollToBottom(); // Scroll down even if there's an error
    } finally {
        // Re-enable the input box and remove the disabled class
        chatInput.disabled = false;
        chatInput.classList.remove('disabled');
        chatInput.placeholder = "Enter a message..."; // Restore the placeholder
        chatInput.focus();
        chatInput.select();
    }
}

const handleChat = (backupMessage) => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        userMessage = backupMessage;
    }

    // Disable the input textarea and add the disabled class
    chatInput.disabled = true;
    chatInput.classList.add('disabled');
    chatInput.placeholder = ""; // Clear the placeholder

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    smoothScrollToBottom(); // Scroll down after the user sends a message

    // Generate response from the server
    generateResponse(userMessage);
}

const clearChat = async () => {
    await fetch('https://henrychat-chcsg5bveah4fpcp.eastus-01.azurewebsites.net/clear_chat');
    chatbox.innerHTML = `
<li class="chat incoming">
  <span class="material-symbols-outlined">support_agent</span>
  <p>Hi there 👋<br>How can I help you today?</p>
</li>
<li class="initial_journeys">
  <div class="card payroll_issue">
    <div class="title">
      <span class="light material-symbols-outlined">payments</span>
      <h4>Investigate Payroll Issues</h4>
    </div>
    <p class="description">I noticed a discrepancy in my payroll statement.</p>
  </div>
  <div class="card leave_request">
    <div class="title">
      <span class="light material-symbols-outlined">calendar_today</span>
      <h4>Submit Leave Request</h4>
    </div>
    <p class="description">I want to submit a request for paid time off.</p>
  </div>
  <div class="card hr_inquiry">
    <div class="title">
      <span class="light material-symbols-outlined">info</span>
      <h4>General HR Inquiry</h4>
    </div>
    <p class="description">I have questions about HR policies.</p>
  </div>
  <div class="card training_resources">
    <div class="title">
      <span class="light material-symbols-outlined">school</span>
      <h4>Access Training Resources</h4>
    </div>
    <p class="description">What training resources are available for me?</p>
  </div>
</li>
    `;
    // Add event listeners for the new cards
    document.querySelector('.payroll_issue').addEventListener("click", startPayrollIssueJourney);
    document.querySelector('.leave_request').addEventListener("click", startLeaveRequestJourney);
    document.querySelector('.hr_inquiry').addEventListener("click", startHRInquiryJourney);
    document.querySelector('.training_resources').addEventListener("click", startTrainingResourcesJourney);
    chatInput.placeholder = "Something else...";
}

const startPayrollIssueJourney = async () => {
    handleChat('I noticed a discrepancy in my payroll statement. Can you help me?');
}

const startLeaveRequestJourney = async () => {
    handleChat('I would like to submit a request for paid time off.');
}

const startHRInquiryJourney = async () => {
    handleChat('I have questions about HR policies.');
}

const startTrainingResourcesJourney = async () => {
    handleChat('What training resources are available for me?');
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
document.querySelector('header p').addEventListener("click", clearChat);
document.querySelector('.payroll_issue').addEventListener("click", startPayrollIssueJourney);
document.querySelector('.leave_request').addEventListener("click", startLeaveRequestJourney);
document.querySelector('.hr_inquiry').addEventListener("click", startHRInquiryJourney);
document.querySelector('.training_resources').addEventListener("click", startTrainingResourcesJourney);
