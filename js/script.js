// 页面加载完成后执行
$(document).ready(function() {
    // 导航栏滚动效果
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // 移动端菜单切换
    $('.menu-toggle').click(function() {
        $('.nav-links').toggleClass('active');
    });

    // 平滑滚动
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });

    // 初始化动画
    initAnimations();

    // 初始化游戏
    if ($('.game-container').length) {
        initGame();
    }

    // 初始化承诺书
    if ($('.commitment-form').length) {
        initCommitment();
    }

    // 初始化海报生成
    if ($('.poster-generator').length) {
        initPosterGenerator();
    }
});

// 滚动到指定区域
function scrollToSection(sectionId) {
    $('html, body').animate({
        scrollTop: $('#' + sectionId).offset().top - 70
    }, 800);
}

// 初始化动画
function initAnimations() {
    // 元素进入视口时的动画
    $(window).scroll(function() {
        $('.stat-item, .legal-card, .interactive-card').each(function() {
            var elementTop = $(this).offset().top;
            var elementVisible = 150;
            if ($(window).scrollTop() > elementTop - $(window).height() + elementVisible) {
                $(this).addClass('animate__animated animate__fadeInUp');
            }
        });
    });

    // 英雄区域浮动图标动画
    gsap.to('.floating-icon:nth-child(1)', {
        y: [-20, 20, -20],
        rotate: [0, 10, 0],
        duration: 6,
        repeat: -1,
        ease: "power2.inOut"
    });

    gsap.to('.floating-icon:nth-child(2)', {
        y: [20, -20, 20],
        rotate: [0, -10, 0],
        duration: 7,
        repeat: -1,
        ease: "power2.inOut"
    });

    gsap.to('.floating-icon:nth-child(3)', {
        y: [-15, 15, -15],
        rotate: [0, 15, 0],
        duration: 5,
        repeat: -1,
        ease: "power2.inOut"
    });
}

// 分享功能
function shareToWeChat() {
    alert('请使用微信扫描二维码分享');
    // 实际项目中可以生成二维码
}

function shareToWeibo() {
    var url = window.location.href;
    var title = document.title;
    var weiboUrl = 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    window.open(weiboUrl, '_blank', 'width=600,height=400');
}

function shareToQQ() {
    var url = window.location.href;
    var title = document.title;
    var qqUrl = 'https://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    window.open(qqUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    var url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        alert('链接已复制到剪贴板');
    }, function() {
        alert('复制失败，请手动复制');
    });
}

function openShareModal() {
    $('#shareModal').addClass('active');
}

function closeShareModal() {
    $('#shareModal').removeClass('active');
}

// 互动游戏
var currentQuestion = 0;
var score = 0;
var questions = [
    {
        question: "根据《治安管理处罚法》，不满多少周岁的人违反治安管理的，不予处罚？",
        options: ["12周岁", "14周岁", "16周岁", "18周岁"],
        correct: 1
    },
    {
        question: "《家庭教育促进法》规定，父母是家庭教育的第几责任人？",
        options: ["第一责任人", "第二责任人", "共同责任人", "次要责任人"],
        correct: 0
    },
    {
        question: "福建省未成年人保护条例》自哪一年起施行？",
        options: ["2024年", "2025年", "2026年", "2027年"],
        correct: 2
    },
    {
        question: "什么是手机口业务？",
        options: ["手机充电服务", "手机维修业务", "电信诈骗手段", "手机销售业务"],
        correct: 2
    },
    {
        question: "每年的国家宪法日是哪一天？",
        options: ["10月1日", "11月4日", "12月4日", "12月26日"],
        correct: 2
    }
];

function initGame() {
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        $('.game-question').text(questions[currentQuestion].question);
        $('.game-options').empty();
        $('.game-feedback').hide();
        $('.game-next').hide();

        questions[currentQuestion].options.forEach(function(option, index) {
            var optionElement = $('<div class="game-option">' + option + '</div>');
            optionElement.data('index', index);
            optionElement.click(function() {
                checkAnswer($(this).data('index'));
            });
            $('.game-options').append(optionElement);
        });
    } else {
        showResult();
    }
}

function checkAnswer(selectedIndex) {
    var isCorrect = selectedIndex === questions[currentQuestion].correct;
    
    $('.game-option').each(function(index) {
        if (index === questions[currentQuestion].correct) {
            $(this).addClass('correct');
        } else if (index === selectedIndex && !isCorrect) {
            $(this).addClass('incorrect');
        }
    });

    if (isCorrect) {
        score++;
        $('.game-feedback').html('正确！').addClass('correct').show();
    } else {
        $('.game-feedback').html('错误！正确答案是：' + questions[currentQuestion].options[questions[currentQuestion].correct]).addClass('incorrect').show();
    }

    $('.game-next').show();
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showResult() {
    var resultMessage = getResultMessage();
    $('.game-container').html('<h2 class="game-title">游戏结束</h2><div class="game-description"><p>你的得分：' + score + '/' + questions.length + '</p><p>' + resultMessage + '</p></div><div class="game-share"><h3>分享你的成绩</h3><div class="share-buttons"><button class="share-btn" onclick="shareGameScore()"><i class="fab fa-weixin"></i><span>微信</span></button><button class="share-btn" onclick="shareGameScore()"><i class="fab fa-weibo"></i><span>微博</span></button><button class="share-btn" onclick="shareGameScore()"><i class="fab fa-qq"></i><span>QQ</span></button></div></div><button class="game-next" onclick="restartGame()">重新开始</button>');
}

function getResultMessage() {
    if (score === questions.length) {
        return '太棒了！你是法律小专家！';
    } else if (score >= questions.length * 0.7) {
        return '很好！你对法律知识掌握得不错！';
    } else if (score >= questions.length * 0.5) {
        return '不错！继续努力学习法律知识！';
    } else {
        return '加油！多学习法律知识，做守法好公民！';
    }
}

function restartGame() {
    currentQuestion = 0;
    score = 0;
    $('.game-container').html('<h2 class="game-title">法律知识小测验</h2><p class="game-description">测试你对法律知识的了解程度，选择正确答案！</p><div class="game-question"></div><div class="game-options"></div><div class="game-feedback"></div><button class="game-next" onclick="nextQuestion()">下一题</button>');
    loadQuestion();
}

// 承诺书
function initCommitment() {
    $('.submit-btn').click(function() {
        var name = $('#name').val();
        var school = $('#school').val();
        var className = $('#class').val();
        var grade = $('#grade').val();

        if (!name || !school || !className || !grade) {
            alert('请填写完整信息');
            return;
        }

        // 生成承诺书
        var commitmentText = `
            法治承诺书
            
            我是${school}${grade}年级${className}班的${name}，在此郑重承诺：
            
            1. 自觉遵守法律法规，做守法好公民；
            2. 积极学习法律知识，增强法治意识；
            3. 尊重他人权利，不参与校园欺凌；
            4. 防范电信诈骗，保护个人信息；
            5. 主动宣传法律知识，带动家人朋友学法守法；
            6. 遇到法律问题，通过合法途径解决。
            
            承诺人：${name}
            学校：${school}
            班级：${grade}年级${className}班
            日期：${new Date().toLocaleDateString()}
        `;

        // 显示承诺书
        alert('承诺书生成成功！\n\n' + commitmentText);

        // 重置表单
        $('.commitment-form')[0].reset();
    });
}

// 海报生成
function initPosterGenerator() {
    $('#poster-title').keyup(updatePosterPreview);
    $('#poster-content').keyup(updatePosterPreview);
    $('#poster-author').keyup(updatePosterPreview);

    $('.generate-btn').click(function() {
        var title = $('#poster-title').val() || '法治为我护航';
        var content = $('#poster-content').val() || '做自己的守护者，学法守法用法';
        var author = $('#poster-author').val() || '大田一中';

        // 生成海报
        $('.poster-template h2').text(title);
        $('.poster-template p').text(content);
        $('.poster-template .poster-footer').text('—— ' + author + ' 「带法回家」活动');

        alert('海报生成成功！');
    });

    $('.download-btn').click(function() {
        alert('海报下载功能开发中，敬请期待！');
    });
}

function updatePosterPreview() {
    var title = $('#poster-title').val() || '法治为我护航';
    var content = $('#poster-content').val() || '做自己的守护者，学法守法用法';
    var author = $('#poster-author').val() || '大田一中';

    $('.poster-template h2').text(title);
    $('.poster-template p').text(content);
    $('.poster-template .poster-footer').text('—— ' + author + ' 「带法回家」活动');
}

// 页面加载动画
$(window).on('load', function() {
    $('body').addClass('loaded');
});

// 添加页面切换动画
$(document).on('click', 'a[href$=".html"]', function(e) {
    e.preventDefault();
    var href = $(this).attr('href');
    $('body').fadeOut(300, function() {
        window.location.href = href;
    });
});

// 分享游戏分数
function shareGameScore() {
    var shareText = '我在大田一中「带法回家」法律知识小测验中获得了 ' + score + '/' + questions.length + ' 分！' + getResultMessage() + ' 快来挑战我吧！';
    var shareUrl = window.location.href;
    
    if (navigator.share) {
        // 使用Web Share API
        navigator.share({
            title: '法律知识小测验成绩',
            text: shareText,
            url: shareUrl
        }).catch(function(error) {
            console.error('分享失败:', error);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        //  fallback分享方式
        fallbackShare(shareText, shareUrl);
    }
}

// 备用分享方式
function fallbackShare(text, url) {
    // 复制分享内容到剪贴板
    var shareContent = text + ' ' + url;
    navigator.clipboard.writeText(shareContent).then(function() {
        alert('分享内容已复制到剪贴板，请粘贴分享给好友！');
    }).catch(function() {
        alert('请手动分享你的成绩：\n' + text + '\n' + url);
    });
}