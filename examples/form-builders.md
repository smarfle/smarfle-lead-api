# Form builders that only take a URL

Many WordPress and website form tools can send each entry to a webhook URL but cannot add a header. Use the key-in-URL endpoint:

```
https://www.smarfle.com/api/webhook/leads/rk_your_key_here
```

It accepts JSON, regular form posts and URL-encoded data, and matches common field names by itself (`name`, `your-name`, `email`, `your-email`, `phone`, `tel`, `message`, `city`, `zip` and Elementor's nested fields). Fields it does not recognize are kept in the lead's request so nothing is lost.

## Contact Form 7

Add a webhook add-on for Contact Form 7, paste the URL above as the webhook URL and send all fields. CF7's default names (`your-name`, `your-email`, `your-message`) are recognized.

## Elementor Pro forms

In the form's **Actions After Submit**, add **Webhook** and paste the URL. Turn on **Advanced Data** if you want field labels sent too.

## WPForms, Gravity Forms, Fluent Forms

Use the plugin's webhook add-on, method POST, and paste the URL. Send the fields as JSON or form data.

## A plain HTML form

You can post a form straight from the browser, because the endpoint allows cross-site requests. The key is then visible in your page source, so anyone could send leads with it. That is the trade-off of a URL-only setup; if spam arrives, generate a new key in Smarfle and update the form.

```html
<form id="quote">
  <input name="name" placeholder="Your name" required>
  <input name="email" type="email" placeholder="Email">
  <input name="phone" placeholder="Phone">
  <textarea name="message" placeholder="What do you need?"></textarea>
  <button>Get a quote</button>
</form>
<script>
document.getElementById("quote").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch("https://www.smarfle.com/api/webhook/leads/rk_your_key_here", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  e.target.innerHTML = res.ok ? "<p>Thanks, we will be in touch soon.</p>" : "<p>Something went wrong, please call us.</p>";
});
</script>
```
