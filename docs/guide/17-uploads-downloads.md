---
title: 17. Uploads & Downloads
---

# 17. Uploads & Downloads


**Uploads (`setInputFiles`):**

```ts
// on an <input type="file">
await page.getByLabel('Upload file').setInputFiles('myfile.pdf');
await page.getByLabel('Upload files').setInputFiles(['a.txt', 'b.txt']);
await page.getByLabel('Upload').setInputFiles({ name: 'x.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') });

// dynamic input → wait for the file chooser event
const fileChooserPromise = page.waitForEvent('filechooser');
await page.getByLabel('Upload').click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles('myfile.pdf');
```

**Downloads:**

```ts
// wait BEFORE clicking
const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;
await download.saveAs('/tmp/' + download.suggestedFilename());
// also: download.url(), download.failure(), download.path()
```

**Remember:** downloaded files are deleted when the context closes; `saveAs()` persists them. Files download to a temp folder by default.

---
