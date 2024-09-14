# Saving Data Records with Forms

Enpage makes it really easy to save Data Records using forms using a few html attributes.
It is the developer/designer responsibility to write the form and define the Data Record schema,
while Enpage will take care of the form validation and submission.

### Example

::: code-group

```html [index.html]
<!-- Fill your Data record identifier in "ep-record" attribute -->
<form ep-record="contactFormSubmissions">
  <p>
    <label for="name">Name</label>
    <!-- No need for a "required" attribute,
         it will be automatically added when needed -->
    <input type="text" name="name">
  </p>
  <p>
    <!--  input "name" attribute should reflect the data record schema -->
    <label for="email">Email</label>
    <input type="email" name="email">
  </p>
  <p>
    <label for="message">Message</label>
    <textarea name="message"></textarea>
  </p>
  <p>
    <!-- make sure to use type=submit-->
    <button type="submit">Submit</button>
  </p>

  <!-- A global form error message -->
  <template ep-form-error>
    <p>There was an error submitting the form. Please try again.</p>
  </template>

  <!-- A global confirmation message when data is saved -->
  <template ep-form-success>
    <p>Thank you for your submission!</p>
  </template>

</form>
```

```javascript [enpage.config.js]
import { defineDataRecords } from "@enpage/sdk/datarecords";

// Define an external data record that will be used
// in the template to let users submit a contact form

export const datarecords = defineDataRecords({
  contactFormSubmissions: {
    // Label of the data source that will be displayed in the Enpage Dashboard
    name: "Contact form submissions",
    // use the built-in "google-sheets" provider
    provider: "google-sheets",
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string().min(20),
    })
  }
});
```

:::
