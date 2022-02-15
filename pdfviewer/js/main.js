const url = 'https://docs.google.com/document/d/1fT9BVwpQR-YkDXl2a3OHBA46aOrMJmEl/edit?usp=sharing&ouid=118283446022187761679&rtpof=true&sd=true';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

function run() {
    // 8887 is the port number you have launched your serve
    var URL = "";

    window.open(URL, null);

}
run();

const scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;
    });
};

// Check for pages rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Show Prev Page
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Get Document
pdfjsLib
    .getDocument(url)
    .promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;

        document.querySelector('#page-count').textContent = pdfDoc.numPages;

        renderPage(pageNum);
    })
    .catch(err => {
        // Display error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message));
        document.querySelector('body').insertBefore(div, canvas);
        // Remove top bar
        document.querySelector('.top-bar').style.display = 'none';
    });
//zoom-in and zoom-out
document.getElementById('zoom_in').addEventListener('click', (e) => {
    if (myState.pdf == null) return;
    myState.zoom += 0.5;
    render();
});

document.getElementById('zoom_out').addEventListener('click', (e) => {
    if (myState.pdf == null) return;
    myState.zoom -= 0.5;
    render();
});

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);