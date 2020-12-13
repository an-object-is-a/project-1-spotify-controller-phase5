document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.runtime.sendMessage({ from: 'popup', message: 'logout' }, function (response) {
        if (response.message === 'success') window.close();
    });
});

document.querySelector('#tester').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'tester' });
});