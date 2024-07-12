# Data Records Methods

::: tip Alternative
Keep in mind that you can also use forms to save data records.
Check the [Saving Data with Forms](../guides/data-records/forms.md) guide for more information.
:::

## `enpage.saveDataRecord(dataRecordId: string, data: unknown): Promise<void>`

Saves a `data` record for the given `dataRecordId` (declared in `enpage.config.js`).
Depending on the Data Record provider, the data will be saved in different places.

```javascript
enpage.saveDataRecord("contactFormSubmissions", {
  name: "John Doe",
  email: "john.doe@example.com"
});
```
