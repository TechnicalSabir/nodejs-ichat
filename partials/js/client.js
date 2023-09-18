const socket = io('http://127.0.0.1:8000');

function newMessage(name, message, from) {
    $('.message-input input').val(null);
    element = `<li class="${from}">
    <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
    <div>
    <span class="sender-name">${name}</span>
    <p>${message}</p>
    </div>
    </li>`;
    $(element).appendTo($('.messages ul'));
    // $('.contact.active .preview').html('<span>You: </span>' + message);
    $(".messages").animate({
        scrollTop: $(document).height()
    }, "fast");
};

function notify(message) {
    p = document.createElement('p');
    p.classList.add('online_user');
    p.innerHTML = `<b>${message}</b>`;
    document.body.append(p);
    $('.online_user').fadeOut(8000);
}

const userName = prompt('Enter your name to join this chat.')

if (userName != '') {
    //sending request to join the chat
    socket.emit('new-user-join', userName);

    //listing request to who is joining
    socket.on('user-joined', (name) => {
        message = `${name} has join the chat`;
        notify(message);
    })

    // event listener on sending message box
    $('.submit').click(function () {
        message = $(".message-input input").val();

        if ($.trim(message) != '') {
            newMessage("You", message, "replies");
            socket.emit('send', message);
        } else {
            return false;
        }
    });

    // event listener on sending message box
    $(window).on('keydown', function (e) {
        message = $(".message-input input").val();
        if (e.which == 13 && message != '') {
            newMessage("You", message, "replies");
            socket.emit('send', message);
            return false;
        }
    });

    socket.on('recieve', (data) => {
        newMessage(data.name, data.message, "sent")
    })

    socket.on('left', (name) => {
        message = `${name} has left the chat`;
        notify(message);
        console.log(name)
    })
}




