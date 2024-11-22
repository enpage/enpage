# Data Records

Data Records allow you to define what users can submit/save from within a website,
such as contact-form data, newsletter subscriptions, user comments, etc.

**There are 2 types of Data Records:**

- **Internal**: Data is saved within Enpage and can be retrieved via the Enpage Dashboard or the Enpage API.
- **External**: Data is saved in a third-party service (such as an API, Google Sheets, Airtable, etc.).

For both types of Data Records, Enpage provides you with [built-in Data Records](./built-in/) that you can use without any additional configuration.

You can also define your own *custom* Data Records, being internal or external.

Data Records are defined in the `enpage.config.js` file using the `defineDataRecords()` function.
Define as many Data Records as you want.

:::warning Difference between Data Records and Data Sources
Data Records are used to save data submitted by users, while Data Sources are used to fetch data to be displayed in templates. Data Records
cannot be consumed by templates, while Data Sources can.
:::

## Internal Data Records

### Using Built-In Internal Data Records

::: code-group

```javascript [enpage.config.js]
import { defineDataRecords } from "@upstart.gg/sdk/datarecords";

// Define an internal data record that will be used
// in the template to let users subscribe to a newsletter

export const datarecords = defineDataRecords({
  newsletterSubscriptions: {

    // Label of the data source displayed in the Enpage Dashboard
    name: "Newsletter subscriptions",

    // use the built-in "generic-email-list" schema
    schema: "generic-email-list"
  }
});
```

:::

### Using Custom Internal Data Records

::: code-group

```javascript [enpage.config.js]
import z from "zod";
import { defineDataRecords } from "@upstart.gg/sdk/datarecords";

// Define an internal data record that will be used
// in the template to let users submit a contact form

export const datarecords = defineDataRecords({
  contactFormSubmissions: {

    // Label of the data source displayed in the Enpage Dashboard
    name: "Contact form submissions",

    // Schema of the data record (using zod)
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string().min(20),
    }),
  }
});

```

:::

## External Data Records

When using external Data Records, data is saved in a third-party service (such as an API, Google Sheets, Airtable, etc.).
As no data is saved to Enpage in this case, it cannot be retrieved through the Enpage Dashboard or the Enpage API.

### Using Built-In External Data Records

::: code-group

```javascript [enpage.config.js]
import { defineDataRecords } from "@upstart.gg/sdk/datarecords";

// Define an external data record that will be used
// in the template to let users submit a contact form

export const datarecords = defineDataRecords({
  contactFormSubmissions: {

    // Label of the data source displayed in the Enpage Dashboard
    name: "Contact form submissions",

    // Use the built-in "google-sheets" provider
    provider: "google-sheets",

    // Declare the schema of the data record to handle
    // form validation and data submission
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string().min(20),
    })
  }
});
```

:::

### Using Custom External Data Records

::: code-group

```javascript [enpage.config.js]
import z from "zod";
import { defineDataRecords } from "@upstart.gg/sdk/datarecords";

// Define an external data record that will be used
// in the template to let users submit a contact form

export const datarecords = defineDataRecords({
  contactFormSubmissions: {

    // Label of the data source displayed in the Enpage Dashboard
    name: "Contact form submissions",

    // Schema of the data record (using zod)
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string().min(20),
    }),

    // Custom provider
    provider: {
      type: "custom",
      // URL of the API endpoint
      url: "https://api.example.com/submit-contact-form",
      // Method to use when submitting data (default is post)
      method: "POST",
      // Headers to send with the request
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer {{ attributes.authToken }}"
      },
    }
  }
});
```

:::

> [!TIP]
> You can reference the attributes of the template in the `url` and `headers` properties. This way, you can pass dynamic values to your API and have the site owner configure them in the Upstart Editor.
Use the notation <code v-pre>{{ attributes.attributeName }}</code> to reference an attribute.
