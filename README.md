# Mobx devtools

  Mobx devtools can display the current state of your application in real-time and record every action that occurs in Mobx.

  To use it, you can install the browser extension.

## Development

#### Step 1: Start the project
```shell
pnpm i
pnpm run dev
```

#### Step 2: Install the extension
To install the extension in Chrome:
Enter `chrome://extensions/` in the URL bar
Load the unpacked extension
The path should be `${project directory}/packages/extension/chrome`

#### Step 3: Use browser debugging
```shell
pnpm run example
```

Open `${project directory}/examples/extension-example/index.html` in your browser, and open devtools.



<video src="https://private-user-images.githubusercontent.com/160824233/306896559-c5caf127-a2a1-4251-a2c1-2a5e96c61ff6.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDg2MDI1NzMsIm5iZiI6MTcwODYwMjI3MywicGF0aCI6Ii8xNjA4MjQyMzMvMzA2ODk2NTU5LWM1Y2FmMTI3LWEyYTEtNDI1MS1hMmMxLTJhNWU5NmM2MWZmNi5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMjIyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDIyMlQxMTQ0MzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zZTg2ODFjNGFlNTQwMjZhY2E5ZGEwOTVhNTJiMTA0ZDlhZjEyOTZkYTUwOWZhNjc2ZTRkZGMxNjcwYTIzYWEzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.QCyAaJzBr6dx2d8IPOZogyK0CkNB-nykjzzT8tfTxhY"></video>
