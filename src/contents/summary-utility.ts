export const createSummary = async (url: string) => {
  // requets to the server to get the summary
  const response = await fetch(
    `${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/v1/summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    }
  );

  // download the summary as a file
  if (!response.ok) {
    throw new Error("Failed to get summary");
  }

  // read the file from the response
  const blob = await response.blob();

  // create a URL for the file
  const blobURL = window.URL.createObjectURL(blob);

  // create a link element
  const link = document.createElement("a");

  console.log(response.headers);

  let file_name = response.headers
    .get("Content-Disposition")
    .split("filename=")[1];
  if (!file_name) {
    file_name = "summary.txt";
  }

  // if the filename contains some special characters, which are not allowed in the file name then replace them with an underscore
  file_name = file_name.replace(/[^a-z0-9.]/gi, "_");


  console.log(file_name);
  // set the href and download attributes of the link
  link.href = blobURL;
  link.download = file_name;

  // append the link to the body
  document.body.appendChild(link);

  // simulate a click on the link
  link.click();

  // remove the link from the body
  document.body.removeChild(link);
};
