/*
	***********************************
	*                                 *
	* Constant Attributes Definitions *
	*                                 *
	***********************************
*/

const header = $("[id=about_me_header]");

/*
	***********************************
	*                                 *
	*        Setup functions          *
	*                                 *
	***********************************
*/

$().ready(function() {
	const detail = $("[id='slow_dog_link']");
	if (detail != null) {
		detail.hide();
	}
});

/*
	***********************************
	*                                 *
	*        Main functions           *
	*                                 *
	***********************************
*/

const headerChangeText = (function() {
	if (header.attr("data-nbd-typewriterTriggered") === "true") {return;}
	if (!exists($( this ).attr('data-nbd-orgin-html'))) {
		$( this ).attr('data-nbd-orgin-html', $( this ).html());
	}
	$( this ).html('Curious?');
});

const headerRevertText = (function() {
	$( this ).html($( this ).attr('data-nbd-orgin-html'));
});

header.on( "mouseenter", headerChangeText).on( "mouseleave", headerRevertText);

header.on("click", function() {
	if (header.attr("data-nbd-typewriterTriggered") === "true") {return;}
	$( this ).attr("data-nbd-typewriterTriggered", "true");
	$( this ).removeClass('pulse');
	$("[id=text_wrapper_div]").removeClass("shadow-hidden");
	stateTypewriter();
	sleep(1000).then(disableButton("more_link")).then(
		removeFromShadow("more_link")
	);
});

const itemIsReadyForTypeWriting = (function(item) {
	return item.getAttribute('data-nbd-twinit') === 'true'
});

function stateTypewriter(callback) {
	conditionallyDisableShowMore();
    const items = $('[data-nbd-tw]');
	items.toArray().forEach(item => hideItemText(item));
	let index = 0;
	const hiddenTypewriterItem = items.toArray().find(e => e.getAttribute('data-nbd-twinit') != "true");
	if (hiddenTypewriterItem != null)
	{
		hiddenTypewriterItem.setAttribute('data-nbd-twinit', 'true');
		basicTypeWrite(hiddenTypewriterItem, 0);
	}
	else {
        fadeOutShowMoreLink() 
	}
}

function fadeOutShowMoreLink() {
	$("[id=more_link]").fadeOut('slow');
		$().ready(function() {
			const detail = $("[id='slow_dog_link']");
			detail.fadeIn(600);
		});

}

function conditionallyDisableShowMore() {
	const showMoreButton = $("[id=more_link]");
	const isDisabled = showMoreButton.prop("disabled");
	if (!isDisabled)
	{
		disableButton(showMoreButton.attr("id"));
	}
}

function hideItemText(item) {
	if (item != null && (item.getAttribute('data-nbd-twtext') == null || item.getAttribute('data-nbd-twtext') == undefined)) {
		item.style.color = item.style.color.replace('var(--bs-body-bg)', '');
        item.setAttribute('data-nbd-twtext', item.innerHTML);
		const textLength = item.innerHTML.length;
        item.innerHTML = '';
    }
}

function basicTypeWrite(item, offset, typewriterCollection) {
	const textLength = item.innerHTML.length - offset;
    const twFullText = item.getAttribute('data-nbd-twtext').length;
    if (textLength < twFullText) {
        const currentCusorPosition = textLength;
        const delay = safeParseInt(item.getAttribute('data-nbd-twspeed'), 10, 50);
        setTimeout(function() {
            item.innerHTML = stripTypeWriterCharacters(item.innerHTML);
            item.innerHTML += item.getAttribute('data-nbd-twtext').charAt(currentCusorPosition);
            item.innerHTML += '|';
            basicTypeWrite(item, 1, typewriterCollection);
        }, delay);
    } else {
        item.innerHTML = stripTypeWriterCharacters(item.innerHTML);
		item.setAttribute('data-nbd-twfin', 'true');
		enablePulseButton("more_link");
		if (typewriterCollection != null){
			const nextElem = typewriterCollection.collection[typewriterCollection.idx];
			if (nextElem != undefined)
			{
				nextElem.setAttribute('data-nbd-twinit', 'true');
			}
		}
    }
}

function revealDog() {
    var elem = $('div[id=taz_img]');
    var hiddenImg = elem.hasClass('hidden-img');
    if (hiddenImg === true) {
        elem.removeClass('hidden-img');
    } else {
        elem.addClass($(elem).attr('data-class'));
    }
	
	if ($("[id=show_dog_link]").text() === "dog tax") {
		$("[id=show_dog_link]").text("Say bye");
	} else {
		$("[id=show_dog_link]").text("dog tax");
	}
}

/*
	Popover logic
*/
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

async function writeClipboardText(text, parentId) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
    setTimeout(function() {
        const comprString = $('#' + parentId).attr('aria-describedby');
        const popover = popoverList.filter(e => e.tip.id === comprString)[0];
        if (popover != null) {
            popover.hide();
        }
    }, 1150);
}

$("li[class=card-list-item] > div[class=card]").on("mouseenter", addWhitePulseEffect).on("mouseleave", removeWhitePulseEffect);
$("[id=return_blog_button]").on("mouseenter", addWhitePulseEffect).on("mouseleave", removeWhitePulseEffect);
$("[id=error_page_back_link_container]").on("mouseenter", addWhitePulseEffect).on("mouseleave", removeWhitePulseEffect);

/*
	********************************
	*                              *
	*       Util Functions         *
	*                              *
	********************************
*/
function safeParseInt(toParse, radix, defaultVal) {
    const rVal = parseInt(toParse, radix);
    if (isNaN(rVal)) {
        return defaultVal;
    }
    return rVal;
}

function exists(item) {
	return item != null && item != undefined && !isNaN(item);
}

const stripTypeWriterCharacters = str => str.replace('|', '');

async function sleep(wait) {
	await new Promise(resolve => setTimeout(resolve, wait));
}

//predicate is the wake condition
async function sleepCheck(data, predicate) {
	while (!predicate(data)) {
		await new Promise(resolve => setTimeout(resolve, 50));
	}
}

function disableButton(id) {
	$("[id=" + id + "]").attr( "tabindex", -1 );
	$("[id=" + id + "]").prop( "disabled", true );
	$("[id=" + id + "]").addClass( "disabled");
	$("[id=" + id + "]").removeClass( "pulse");
}

function enablePulseButton(id) {
	$("[id=" + id + "]").removeAttr( "tabindex");
	$("[id=" + id + "]").removeAttr( "disabled");
	$("[id=" + id + "]").removeClass( "disabled");
	$("[id=" + id + "]").addClass( "pulse");
}

function shadowHide(id) {
	$("[id=" + id + "]").removeAttr("tabindex");
	$("[id=" + id + "]").attr( "disabled", false );
	$("[id=" + id + "]").removeClass( "disabled");
}

function removeFromShadow(id) {
	$("[id=" + id + "]").removeClass('shadow-hidden');
}

function addWhitePulseEffect() {
	$ ( this ).addClass("white-pulse")
	.addClass("white-pulse")
	.addClass("text-color-dg");
}

function removeWhitePulseEffect() {
	$ ( this ).removeClass("white-pulse")
	.removeClass("white-pulse")
	.removeClass("text-color-dg");
}
