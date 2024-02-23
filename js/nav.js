const backNav = 
`
<nav id="main_nav_elem" class="navbar" data-bs-theme="dark">
            <div id="return_button_container" class="container-fluid">
                <a id="return_blog_button" class="btn btn-outline-light btn-floating m-1 bg-dark" href="../blogs.html" role="button">
                    <i class="bi bi-arrow-return-left" title="Go Back" aria-description="Go Back"></i>
                </a>
            </div>
        </nav>
`



$(window).on("load", function() {
	$("div[data-nbd-backnav]").replaceWith(backNav);
});
