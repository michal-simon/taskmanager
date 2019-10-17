
<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Sufee Admin - HTML5 Admin Template</title>
        <meta name="description" content="Sufee Admin - HTML5 Admin Template">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" href="apple-icon.png">
        <link rel="shortcut icon" href="favicon.ico">

        <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
        <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('css/themify-icons.css') }}">
        <link rel="stylesheet" href="{{ asset('css/flag-icon.min.css') }}">
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" href="{{ asset('css/timeline.css') }}">
        <link rel="stylesheet" href="{{ asset('css/vector.css') }}">
         <link rel="stylesheet" href="{{ asset('css/morris.css') }}">
        <link rel="stylesheet" href="vendors/selectFX/css/cs-skin-elastic.css">
        <link rel="stylesheet" href="vendors/jqvmap/dist/jqvmap.min.css">

        <link rel="stylesheet" href="{{ asset('css/style.css') }}">

        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>
    </head>
    <body>

        <aside id="left-panel" class="left-panel">
            <nav class="navbar navbar-expand-sm navbar-default">
                <div class="navbar-header">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fa fa-bars"></i>
                    </button>
                    <a class="navbar-brand" href="#"><img src="images/logo.png" alt="Logo"></a>
                    <a class="navbar-brand hidden" href="#"><img src="images/logo2.png" alt="Logo"></a>
                </div>
                <div id="main-menu" class="main-menu collapse navbar-collapse">
                    <ul class="nav navbar-nav">

                     <li>
                                                <a href="/dashboard"> <i class="menu-icon fa fa-dashboard"></i>Dashboard </a>
                                            </li>

                                             <li>
                                                                        <a href="/activity"> <i class="menu-icon fa fa-dashboard"></i>Activity </a>
                                                                    </li>

                                                                     <li>
                                                                                                                                            <a href="/brands"> <i class="menu-icon fa fa-dashboard"></i>Brands </a>
                                                                                                                                        </li>

                                                                                                                                         <li>
                                                                                                                                                                                                                <a href="/categories"> <i class="menu-icon fa fa-dashboard"></i>Categories </a>
                                                                                                                                                                                                            </li>

                        <li>
                            <a href="/users"> <i class="menu-icon fa fa-dashboard"></i>Employees </a>
                        </li>
                        
                          <li>
                            <a href="/statuses"> <i class="menu-icon fa fa-dashboard"></i>Task Statuses </a>
                        </li>

                         <li>
                                                    <a href="/roles"> <i class="menu-icon fa fa-book"></i>Role </a>
                                                </li>
                                                
                                                 <li>
                                                    <a href="/permissions"> <i class="menu-icon fa fa-book"></i>Permissions </a>
                                                </li>

                        <li>
                            <a href="/leads"> <i class="menu-icon fa fa-laptop"></i>Leads </a>
                        </li>

                         <li>
                                                    <a href="/deals"> <i class="menu-icon fa fa-laptop"></i>Deals </a>
                                                </li>

                                                 <li>
                                                                            <a href="/products"> <i class="menu-icon fa fa-laptop"></i>Products </a>
                                                                        </li>

                        <li>
                            <a href="/customers"> <i class="menu-icon fa fa-th"></i>Contacts </a>
                        </li>

                        <li>
                            <a href="/projects"> <i class="menu-icon fa fa-tasks"></i>Tasks </a>
                        </li>

                        <li>
                            <a href="/invoice"> <i class="menu-icon fa fa-glass"></i>Invoices </a>
                        </li>
                        
                        <li>
                            <a href="/calendar"> <i class="menu-icon fa fa-table"></i>Calendar </a>
                        </li>

                          <li>
                            <a href="/chat"> <i class="menu-icon fa fa-table"></i>Chat </a>
                         </li>
                    </ul>
                </div>
            </nav>
        </aside>


        <div id="right-panel" class="right-panel">

            <header id="header" class="header">
                <div class="header-menu">
                    <div class="col-sm-7">
                        <a id="menuToggle" class="menutoggle pull-left"><i class="fa fa fa-tasks"></i></a>
                        <div class="header-left">
                            <button class="search-trigger"><i class="fa fa-search"></i></button>
                            <div class="form-inline">
                                <form class="search-form">
                                    <input class="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search">
                                    <button class="search-close" type="submit"><i class="fa fa-close"></i></button>
                                </form>
                            </div>
                            <div class="dropdown for-notification">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-bell"></i>
                                    <span class="count bg-danger">5</span>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="notification">
                                    <p class="red">You have 3 Notification</p>
                                    <a class="dropdown-item media bg-flat-color-1" href="#">
                                        <i class="fa fa-check"></i>
                                        <p>Server #1 overloaded.</p>
                                    </a>
                                    <a class="dropdown-item media bg-flat-color-4" href="#">
                                        <i class="fa fa-info"></i>
                                        <p>Server #2 overloaded.</p>
                                    </a>
                                    <a class="dropdown-item media bg-flat-color-5" href="#">
                                        <i class="fa fa-warning"></i>
                                        <p>Server #3 overloaded.</p>
                                    </a>
                                </div>
                            </div>
                            <div class="dropdown for-message">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="message" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="ti-email"></i>
                                    <span class="count bg-primary">9</span>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="message">
                                    <p class="red">You have 4 Mails</p>
                                    <a class="dropdown-item media bg-flat-color-1" href="#">
                                        <span class="photo media-left"><img alt="avatar" src="images/avatar/1.jpg"></span>
                                        <span class="message media-body">
                                            <span class="name float-left">Jonathan Smith</span>
                                            <span class="time float-right">Just now</span>
                                            <p>Hello, this is an example msg</p>
                                        </span>
                                    </a>
                                    <a class="dropdown-item media bg-flat-color-4" href="#">
                                        <span class="photo media-left"><img alt="avatar" src="images/avatar/2.jpg"></span>
                                        <span class="message media-body">
                                            <span class="name float-left">Jack Sanders</span>
                                            <span class="time float-right">5 minutes ago</span>
                                            <p>Lorem ipsum dolor sit amet, consectetur</p>
                                        </span>
                                    </a>
                                    <a class="dropdown-item media bg-flat-color-5" href="#">
                                        <span class="photo media-left"><img alt="avatar" src="images/avatar/3.jpg"></span>
                                        <span class="message media-body">
                                            <span class="name float-left">Cheryl Wheeler</span>
                                            <span class="time float-right">10 minutes ago</span>
                                            <p>Hello, this is an example msg</p>
                                        </span>
                                    </a>
                                    <a class="dropdown-item media bg-flat-color-3" href="#">
                                        <span class="photo media-left"><img alt="avatar" src="images/avatar/4.jpg"></span>
                                        <span class="message media-body">
                                            <span class="name float-left">Rachel Santos</span>
                                            <span class="time float-right">15 minutes ago</span>
                                            <p>Lorem ipsum dolor sit amet, consectetur</p>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-5">
                        <div class="user-area dropdown float-right">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img class="user-avatar rounded-circle" src="{{ asset('files/admin.jpg') }}" alt="User Avatar">
                            </a>
                            <div class="user-menu dropdown-menu">
                                <a class="nav-link" href="#"><i class="fa fa- user"></i>My Profile</a>
                                <a class="nav-link" href="#"><i class="fa fa- user"></i>Notifications <span class="count">13</span></a>
                                <a class="nav-link" href="#"><i class="fa fa -cog"></i>Settings</a>
                                <a class="nav-link" href="#"><i class="fa fa-power -off"></i>Logout</a>
                            </div>
                        </div>
                        <div class="language-select dropdown" id="language-select">
                            <a class="dropdown-toggle" href="#" data-toggle="dropdown" id="language" aria-haspopup="true" aria-expanded="true">
                                <i class="flag-icon flag-icon-us"></i>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="language">
                                <div class="dropdown-item">
                                    <span class="flag-icon flag-icon-fr"></span>
                                </div>
                                <div class="dropdown-item">
                                    <i class="flag-icon flag-icon-es"></i>
                                </div>
                                <div class="dropdown-item">
                                    <i class="flag-icon flag-icon-us"></i>
                                </div>
                                <div class="dropdown-item">
                                    <i class="flag-icon flag-icon-it"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="breadcrumbs">
                <div class="col-sm-4">
                    <div class="page-header float-left">
                        <div class="page-title">
                            <h1>Kanban</h1>
                        </div>
                    </div>
                </div>
                <div class="col-sm-8">
                    <div class="page-header float-right">
                        <div class="page-title">
                            <ol class="breadcrumb text-right">
                                <li><a href="#">Kanban</a></li>
                                <li><a href="#">UI Elements</a></li>
                                <li class="active">Buttons</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div class="">
                <div class="animated fadeIn">
                    <div id="app"></div>
                </div>
            </div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js" type="text/javascript"></script>
        <script src="{{ asset('js/popper.js') }}"></script>
        <script src="{{ asset('js/bootstrap.js') }}"></script>
        <script src="{{ asset('js/main.js') }}"></script>
        <script src="{{ asset('js/app.js') }}"></script>
        <script src="{{ asset('js/timeline.js') }}"></script>
        <script src="{{ asset('js/knob.js') }}"></script>
        <script src="{{ asset('js/chart.js') }}"></script>
        <script src="{{ asset('js/test.js') }}"></script>
        <script src="{{ asset('js/test2.js') }}"></script>
         <script src="{{ asset('js/test3.js') }}"></script>
        <script src="{{ asset('js/vector.js') }}"></script>
        <script src="{{ asset('js/echart.js') }}"></script>
        <script src="{{ asset('js/dashboard.js') }}"></script>

        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-23581568-13" type="e9e5abddf22916310e683d1f-text/javascript"></script>
        <script type="e9e5abddf22916310e683d1f-text/javascript">
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-23581568-13');
        </script>
        <script src="https://ajax.cloudflare.com/cdn-cgi/scripts/95c75768/cloudflare-static/rocket-loader.min.js" data-cf-settings="e9e5abddf22916310e683d1f-|49" defer=""></script></body>
</html>
