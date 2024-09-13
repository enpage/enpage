# Data Records Methods

::: tip Alternative
You can also use forms to save data records, which is often more easy.
Check the [Saving Data with Forms](../guides/data-records/forms.md) guide for more information.
:::

## `enpage.saveDataRecord(dataRecordId: string, data: unknown): Promise<void>`

Saves a `data` record for the given `dataRecordId` (declared in `enpage.config.js` or `enpage.config.json`).
Depending on the Data Record provider, the data will be saved in different places.

```javascript
enpage.saveDataRecord("contactFormSubmissions", {
  name: "John Doe",
  email: "john.doe@example.com"
});
```
