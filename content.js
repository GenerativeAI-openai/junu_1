function extractTokens() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    let xToken = '';
    try {
        xToken = localStorage.getItem('playentry_token') || '';
    } catch (e) {
        console.error(e);
    }
    
    return { csrfToken, xToken };
}

async function fetchNotificationData(searchAfter = null) {
    try {
        const { csrfToken, xToken } = extractTokens();

        const variables = {
            pageParam: {
                display: 10
            }
        };

        if (searchAfter) {
            variables.searchAfter = searchAfter;
        }

        const response = await fetch("https://playentry.org/graphql/SELECT_TOPICS", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/json",
                ...(csrfToken && { "csrf-token": csrfToken }),
                ...(xToken && { "x-token": xToken }),
                "x-client-type": "Client"
            },
            "body": JSON.stringify({
                query: `
                    query SELECT_TOPICS($pageParam: PageParam, $searchAfter: JSON){
                      topicList(pageParam: $pageParam, searchAfter: $searchAfter) {
                        searchAfter
                        list {
                          id
                          params
                          template
                          thumbUrl
                          category
                          target
                          isRead
                          created
                          updated
                          link {
                            category
                            target
                            hash
                            groupId
                          }
                          topicinfo {
                            category
                            targetId
                          }
                        }
                      }
                    }
                `,
                variables
            }),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        const data = await response.json();
        if (data && data.data) {
            // console.log(data.data.topicList.list)
            return data.data.topicList.list;
        }

        return [];
    } catch (error) {
        // console.error(error);
        return [];
    }
}
let timeout = 0
async function preview() {
    const notifications = await fetchNotificationData();
    timeout = 0
    // setTimeout(() => {
    //     // console.log("기다림.")
    //     const parent = document.querySelector('.css-1wc2sdr')
    //     const notification = parent.querySelectorAll('li')//css-1fwo2t5.css-1wc2sdr
    //     console.log(notification)
    //     let index = 0;
    //     notification.forEach(notification => {
    //         if (notifications[index].template[0] == "template_13"){//엔트리 이야기 또는 노팁, 묻답 등 커뮤니티
    //             notification.innerHTML = `<li style="cursor: default;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-uigoc8 exgmeid0">커뮤니티</em><em>${notifications[index].params[0]}</em>님이 <em>${notifications[index].params[1]}</em>에 댓글을 남겼습니다.</div><span class="css-u980j1 exgmeid1">0 분 전</span></div></li>`
    //         } else if (notifications[index].template[0] == "template_28") {//새로운 작품
    //             notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 새로운 작품을 공유했습니다.</div><span class="css-u980j1 exgmeid1">2 분 전</span></div></li>`
    //         } else if (notifications[index].template[0] == "template_27") {//팔로잉
    //             notification.innerHTML = `<li style="cursor: pointer;"><div class="css-10adms4 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 나를 팔로잉 합니다.</div><span class="css-u980j1 exgmeid1">1 분 전</span></div></li>`
    //         } else if (notifications[index].template[0] == "template_3") {//팔로잉
    //             notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><span class="css-vwf6be exgmeid4" style="background-image: url(&quot;https://playentry.org${notifications[index].thumbUrl[0]}&quot;);">&nbsp;</span><div class="css-1l656pp exgmeid3"><em class="css-azelyu exgmeid0">작품</em><em>${notifications[index].params[0]}</em>님이 나의 작품을 좋아합니다.</div><span class="css-u980j1 exgmeid1">3 분 전</span></div></li>`
    //         }
    //         index++
    //     });
    // }, 600*timeout);
    // const parent = document.querySelector(".css-1wc2sdr")
    // const notification = parent.querySelectorAll('li')//css-1fwo2t5.css-1wc2sdr
    const notification = document.querySelectorAll(".css-1wc2sdr li")
    // console.log(notification)
    let index = 0;
    notification.forEach(notification => {
        if (notifications[index].template == "template_13"){//엔트리 이야기 또는 노팁, 묻답 등 커뮤니티
            // notification.innerHTML = `<li style="cursor: default;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-uigoc8 exgmeid0">커뮤니티</em><em>${notifications[index].params[0]}</em>님이 <em>${notifications[index].params[1]}</em>에 댓글을 남겼습니다.</div><span class="css-u980j1 exgmeid1">0 분 전</span></div></li>`
            notification.innerHTML = `<li style="cursor: default;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em>${notifications[index].params[0]}</em>님이 <em>${notifications[index].params[1]}</em>에 댓글을 남겼습니다.</div><span class="css-u980j1 exgmeid1">0 분 전</span></div></li>`
        } else if (notifications[index].template == "template_28") {//새로운 작품
            notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 새로운 작품을 공유했습니다.</div><span class="css-u980j1 exgmeid1">2 분 전</span></div></li>`
        } else if (notifications[index].template == "template_27") {//팔로잉
            notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 나를 팔로잉 합니다.</div><span class="css-u980j1 exgmeid1">49 분 전</span></div></li>`
        } else if (notifications[index].template == "template_3") {//좋아요
            notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><span class="css-vwf6be exgmeid4" style="background-image: url(&quot;https://playentry.org${notifications[index].thumbUrl[0]}&quot;);">&nbsp;</span><div class="css-1l656pp exgmeid3"><em class="css-azelyu exgmeid0">작품</em><em>${notifications[index].params[0]}</em>님이 나의 작품을 좋아합니다.</div><span class="css-u980j1 exgmeid1">3 분 전</span></div></li>`
        }
        index++
    });
}
async function addNotificationPreview() {
    const notifications = await fetchNotificationData();//css-1wc2sdr
    document.querySelector(".css-mop10c").click()
    // console.log(notifications, "실행됨!")
    if (document.querySelectorAll('.css-1wc2sdr').length < 1){
        timeout = 1
    } else {
        timeout = 0
    }
    setTimeout(() => {
        console.log("기다림.")
        const parent = document.querySelector('.css-1206xd6')
        const notification = parent.querySelectorAll('li')//css-1fwo2t5.css-1wc2sdr
        console.log(notification)
        let index = 0;
        notification.forEach(notification => {
            if (notifications[index].template[0] == "template_13"){//엔트리 이야기 또는 노팁, 묻답 등 커뮤니티
                notification.innerHTML = `<div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-uigoc8 exgmeid0">커뮤니티</em><em>${notifications[index].params[0]}</em>님이 <em>${notifications[index].params[1]}</em>에 댓글을 남겼습니다.<br><i>1 분 전</i></div></div>`
            } else if (notifications[index].template[0] == "template_28") {//새로운 작품
                //notification.innerHTML = `<div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 새로운 작품을 공유했습니다.</div><span class="css-u980j1 exgmeid1"><br>16 분 전</span></div>`
                notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 새로운 작품을 공유했습니다.</div><span class="css-u980j1 exgmeid1">2 분 전</span></div></li>`
                
            } else if (notifications[index].template[0] == "template_27") {//팔로잉
                notification.innerHTML = `<div class="css-1fwo2t5 exgmeid5"><div class="css-1l656pp exgmeid3"><em class="css-bbbvqf exgmeid0">팔로잉</em><em>${notifications[index].params[0]}</em>님이 나를 팔로잉 합니다.</div><span class="css-u980j1 exgmeid1"><br>2 분 전</span></div>`
            } else if (notifications[index].template[0] == "template_3") {//팔로잉
                notification.innerHTML = `<li style="cursor: pointer;"><div class="css-1fwo2t5 exgmeid5"><span class="css-vwf6be exgmeid4" style="background-image: url(&quot;https://playentry.org${notifications[index].thumbUrl[0]}&quot;);">&nbsp;</span><div class="css-1l656pp exgmeid3"><em class="css-azelyu exgmeid0">작품</em><em>${notifications[index].params[0]}</em>님이 나의 작품을 좋아합니다.</div><span class="css-u980j1 exgmeid1">3 분 전</span></div></li>`
            }
            index++
        });
    }, 600*timeout);
    //const notification = document.querySelector('.css-1wc2sdr li')
    //const notification = parent.querySelectorAll("li")
}

function enhanceNotifications() {
    let currentUrl = window.location.href;
    const isAlarmPage = window.location.href.includes("playentry.org");
    let lastSearchAfter = null;
    console.log("체크")
    // setInterval(() => {
    //     if (currentUrl !== window.location.href) {
    //         currentUrl = window.location.href;
    //         if (isAlarmPage) {
    //             console.log("체크 2")
    //             addNotificationPreview();
    //         }
    //     }
    // }, 1000);
    if(isAlarmPage){
        addNotificationPreview()
    }
}
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

    //setTimeout(() => enhanceNotifications(), 5000)
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', enhanceNotifications);
//     //enhanceNotifications();
// } else {
//     enhanceNotifications();
// }
// document.addEventListener('DOMContentLoaded', function() {
function main() {
    setTimeout(() => {
        preview();
        // console.log('✅잘 실행됨!')
        main();
    }, 1000);
    // try {
    //     // let parent = document.querySelector('.css-1wc2sdr')
    //     // let alarmele = parent.querySelectorAll('li')
    //     // if (alarmele.length > 0) {
    //     //     preview();
    //     // }
    //     preview();
    // } catch (error) {
    // }
    
// })
}
main()
//// requestAnimationFrame(main)
// document.addEventListener('click', function(event) {
//     console.log(event.target)
//     // let alarmele = document.querySelector(".css-mop10c")
//     // if (event.target.matches('.css-mop10c')){//event.target.matches('.css-mop10c e5hayu94')event.target.classList.contains('css-mop10c')
//     //     preview();
//     // }
//     setTimeout(() => {
//         try {
//             let parent = document.querySelector('.css-1wc2sdr')
//             let alarmele = parent.querySelectorAll('li')
//             if (alarmele.length > 0) {
//                 timeout = 0
//             } else {
//                 timeout = 0.25
//             }
//             setTimeout(() => {
//                 preview();
//             }, 600*timeout)
//         } catch (error) {
//             console.log(error)
//         }
//     }, 550);
// });