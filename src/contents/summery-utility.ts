const createSummery = async (url: string) => {
  // requets to the server to get the summery
  const response = await fetch("http://localhost:3000/api/v1/summery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  // download the summery as a file
  if (!response.ok) {
    throw new Error("Failed to get summery");
  }

  // read the file from the response
  const blob = await response.blob();

  // create a URL for the file
  const blobURL = window.URL.createObjectURL(blob);

  // create a link element
  const link = document.createElement("a");

  // set the href and download attributes of the link
  link.href = blobURL;
  link.download = "summary.txt";

  // append the link to the body
  document.body.appendChild(link);

  // simulate a click on the link
  link.click();

  // remove the link from the body
  document.body.removeChild(link);
};
