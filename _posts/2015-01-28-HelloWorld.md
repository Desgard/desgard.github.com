



<!DOCTYPE html>
<html lang="en" class="">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# object: http://ogp.me/ns/object# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    
    
    <title>dgytdhy.github.com/2015-01-05-慕课网学习笔记——Bower的使用实践（1）.md at master · dgytdhy/dgytdhy.github.com</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png">
    <meta property="fb:app_id" content="1401488693436528">

      <meta content="@github" name="twitter:site" /><meta content="summary" name="twitter:card" /><meta content="dgytdhy/dgytdhy.github.com" name="twitter:title" /><meta content="dgytdhy.github.com - octopress blog" name="twitter:description" /><meta content="https://avatars1.githubusercontent.com/u/7804535?v=3&amp;s=400" name="twitter:image:src" />
<meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="https://avatars1.githubusercontent.com/u/7804535?v=3&amp;s=400" property="og:image" /><meta content="dgytdhy/dgytdhy.github.com" property="og:title" /><meta content="https://github.com/dgytdhy/dgytdhy.github.com" property="og:url" /><meta content="dgytdhy.github.com - octopress blog" property="og:description" />

      <meta name="browser-stats-url" content="/_stats">
    <link rel="assets" href="https://assets-cdn.github.com/">
    <link rel="conduit-xhr" href="https://ghconduit.com:25035">
    <link rel="xhr-socket" href="/_sockets">
    <meta name="pjax-timeout" content="1000">
    <link rel="sudo-modal" href="/sessions/sudo_modal">

    <meta name="msapplication-TileImage" content="/windows-tile.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="selected-link" value="repo_source" data-pjax-transient>
      <meta name="google-analytics" content="UA-3769691-2">

    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="7930B84C:72C5:41D562:54C8A254" name="octolytics-dimension-request_id" /><meta content="7804535" name="octolytics-actor-id" /><meta content="dgytdhy" name="octolytics-actor-login" /><meta content="6ef3330dfe10d8a73973877ed73ba8894d575ac23e21d6908349948c39168dd2" name="octolytics-actor-hash" />
    
    <meta content="Rails, view, blob#show" name="analytics-event" />

    
    
    <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">


    <meta content="authenticity_token" name="csrf-param" />
<meta content="hHwsArsqLf+zqo34Msv8Itvu+1/cTwjt4vFoglNeS+lPZ+tx0hScHO2HUgLJ3mg0SXqJH+bTb8wk9XBgD2hV9w==" name="csrf-token" />

    <link href="https://assets-cdn.github.com/assets/github-f19e43be00c28904df28a1fd1fa3c117e5d2358dd3cf0f4216536f8737c2e033.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://assets-cdn.github.com/assets/github2-29c7da379589a0dc8a4aeee9d661ddbbc6726ded580d170ced239d72d1137908.css" media="all" rel="stylesheet" type="text/css" />
    
    


    <meta http-equiv="x-pjax-version" content="52aee216f294b9c9a6a8b25f193226a4">

      
  <meta name="description" content="dgytdhy.github.com - octopress blog">
  <meta name="go-import" content="github.com/dgytdhy/dgytdhy.github.com git https://github.com/dgytdhy/dgytdhy.github.com.git">

  <meta content="7804535" name="octolytics-dimension-user_id" /><meta content="dgytdhy" name="octolytics-dimension-user_login" /><meta content="29953496" name="octolytics-dimension-repository_id" /><meta content="dgytdhy/dgytdhy.github.com" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="29953496" name="octolytics-dimension-repository_network_root_id" /><meta content="dgytdhy/dgytdhy.github.com" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/dgytdhy/dgytdhy.github.com/commits/master.atom" rel="alternate" title="Recent Commits to dgytdhy.github.com:master" type="application/atom+xml">

  </head>


  <body class="logged_in  env-production windows vis-public page-blob">
    <a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
    <div class="wrapper">
      
      
      
      


      <div class="header header-logged-in true" role="banner">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/" data-hotkey="g d" aria-label="Homepage" ga-data-click="Header, go to dashboard, icon:logo">
  <span class="mega-octicon octicon-mark-github"></span>
</a>


      <div class="site-search repo-scope js-site-search" role="search">
          <form accept-charset="UTF-8" action="/dgytdhy/dgytdhy.github.com/search" class="js-site-search-form" data-global-search-url="/search" data-repo-search-url="/dgytdhy/dgytdhy.github.com/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
  <input type="text"
    class="js-site-search-field is-clearable"
    data-hotkey="s"
    name="q"
    placeholder="Search"
    data-global-scope-placeholder="Search GitHub"
    data-repo-scope-placeholder="Search"
    tabindex="1"
    autocapitalize="off">
  <div class="scope-badge">This repository</div>
</form>
      </div>
      <ul class="header-nav left" role="navigation">
        <li class="header-nav-item explore">
          <a class="header-nav-link" href="/explore" data-ga-click="Header, go to explore, text:explore">Explore</a>
        </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="https://gist.github.com" data-ga-click="Header, go to gist, text:gist">Gist</a>
          </li>
          <li class="header-nav-item">
            <a class="header-nav-link" href="/blog" data-ga-click="Header, go to blog, text:blog">Blog</a>
          </li>
        <li class="header-nav-item">
          <a class="header-nav-link" href="https://help.github.com" data-ga-click="Header, go to help, text:help">Help</a>
        </li>
      </ul>

    
<ul class="header-nav user-nav right" id="user-links">
  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link name" href="/dgytdhy" data-ga-click="Header, go to profile, text:username">
      <img alt="Desgard_Duan" class="avatar" data-user="7804535" height="20" src="https://avatars2.githubusercontent.com/u/7804535?v=3&amp;s=40" width="20" />
      <span class="css-truncate">
        <span class="css-truncate-target">dgytdhy</span>
      </span>
    </a>
  </li>

  <li class="header-nav-item dropdown js-menu-container">
    <a class="header-nav-link js-menu-target tooltipped tooltipped-s" href="#" aria-label="Create new..." data-ga-click="Header, create new, icon:add">
      <span class="octicon octicon-plus"></span>
      <span class="dropdown-caret"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      
<ul class="dropdown-menu">
  <li>
    <a href="/new" data-ga-click="Header, create new repository, icon:repo"><span class="octicon octicon-repo"></span> New repository</a>
  </li>
  <li>
    <a href="/organizations/new" data-ga-click="Header, create new organization, icon:organization"><span class="octicon octicon-organization"></span> New organization</a>
  </li>


    <li class="dropdown-divider"></li>
    <li class="dropdown-header">
      <span title="dgytdhy/dgytdhy.github.com">This repository</span>
    </li>
      <li>
        <a href="/dgytdhy/dgytdhy.github.com/issues/new" data-ga-click="Header, create new issue, icon:issue"><span class="octicon octicon-issue-opened"></span> New issue</a>
      </li>
      <li>
        <a href="/dgytdhy/dgytdhy.github.com/settings/collaboration" data-ga-click="Header, create new collaborator, icon:person"><span class="octicon octicon-person"></span> New collaborator</a>
      </li>
</ul>

    </div>
  </li>

  <li class="header-nav-item">
        <a href="/notifications" aria-label="You have no unread notifications" class="header-nav-link notification-indicator tooltipped tooltipped-s" data-ga-click="Header, go to notifications, icon:read" data-hotkey="g n">
        <span class="mail-status all-read"></span>
        <span class="octicon octicon-inbox"></span>
</a>
  </li>

  <li class="header-nav-item">
    <a class="header-nav-link tooltipped tooltipped-s" href="/settings/profile" id="account_settings" aria-label="Settings" data-ga-click="Header, go to settings, icon:settings">
      <span class="octicon octicon-gear"></span>
    </a>
  </li>

  <li class="header-nav-item">
    <form accept-charset="UTF-8" action="/logout" class="logout-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="woIMx8jKRo93jBcm2uycIxvV4uZV5NMXjESKqqX7xNieUFrpCPwd4HB08cTH0O/+ExMrX6LKlE0V5VX5QqIH1g==" /></div>
      <button class="header-nav-link sign-out-button tooltipped tooltipped-s" aria-label="Sign out" data-ga-click="Header, sign out, icon:logout">
        <span class="octicon octicon-sign-out"></span>
      </button>
</form>  </li>

</ul>


    
  </div>
</div>

      

        


      <div id="start-of-content" class="accessibility-aid"></div>
          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    <div id="js-flash-container">
      
    </div>
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        
<ul class="pagehead-actions">

    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="qoX1ahc2UaNUNCjZyWmquzoH7rwCl+iC2pDdTVAcsmQxM+vKzE28BvTSU+UxO7aLnYMA1j3oVHRDqr5+dgLNfQ==" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="29953496" />

    <div class="select-menu js-menu-container js-select-menu">
      <a class="social-count js-social-count" href="/dgytdhy/dgytdhy.github.com/watchers">
        1
      </a>
      <a href="/dgytdhy/dgytdhy.github.com/subscription"
        class="minibutton select-menu-button with-count js-menu-target" role="button" tabindex="0" aria-haspopup="true">
        <span class="js-select-button">
          <span class="octicon octicon-eye"></span>
          Unwatch
        </span>
      </a>

      <div class="select-menu-modal-holder">
        <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-hidden="true">
          <div class="select-menu-header">
            <span class="select-menu-title">Notifications</span>
            <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container" role="menu">

            <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">Be notified when participating or @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">Be notified of all conversations.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">Never be notified.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

  <li>
    
  <div class="js-toggler-container js-social-container starring-container ">

    <form accept-charset="UTF-8" action="/dgytdhy/dgytdhy.github.com/unstar" class="js-toggler-form starred js-unstar-button" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="LtE1T3tWCABCQusgteQeJRLXBq/N77tVLXMX/NjTbijXqqoFxuxhlEHT9IszqF7/w78kEWYINPLxJ1Yf5D3ASw==" /></div>
      <button
        class="minibutton with-count js-toggler-target star-button"
        aria-label="Unstar this repository" title="Unstar dgytdhy/dgytdhy.github.com">
        <span class="octicon octicon-star"></span>
        Unstar
      </button>
        <a class="social-count js-social-count" href="/dgytdhy/dgytdhy.github.com/stargazers">
          0
        </a>
</form>
    <form accept-charset="UTF-8" action="/dgytdhy/dgytdhy.github.com/star" class="js-toggler-form unstarred js-star-button" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="/6OrOk7Fh50L4QIJ9bMiRGyv344sxxoPSEv2O6bGZEmw4U23RV0QalvlXrUHcKtYArFMVG0zASLqxRecaNmVrg==" /></div>
      <button
        class="minibutton with-count js-toggler-target star-button"
        aria-label="Star this repository" title="Star dgytdhy/dgytdhy.github.com">
        <span class="octicon octicon-star"></span>
        Star
      </button>
        <a class="social-count js-social-count" href="/dgytdhy/dgytdhy.github.com/stargazers">
          0
        </a>
</form>  </div>

  </li>


        <li>
          <a href="/dgytdhy/dgytdhy.github.com/fork" class="minibutton with-count js-toggler-target fork-button tooltipped-n" title="Fork your own copy of dgytdhy/dgytdhy.github.com to your account" aria-label="Fork your own copy of dgytdhy/dgytdhy.github.com to your account" rel="nofollow" data-method="post">
            <span class="octicon octicon-repo-forked"></span>
            Fork
          </a>
          <a href="/dgytdhy/dgytdhy.github.com/network" class="social-count">0</a>
        </li>

</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="mega-octicon octicon-repo"></span>
          <span class="author"><a href="/dgytdhy" class="url fn" itemprop="url" rel="author"><span itemprop="title">dgytdhy</span></a></span><!--
       --><span class="path-divider">/</span><!--
       --><strong><a href="/dgytdhy/dgytdhy.github.com" class="js-current-repository" data-pjax="#js-repo-pjax-container">dgytdhy.github.com</a></strong>

          <span class="page-context-loader">
            <img alt="" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline  ">
        <div class="repository-sidebar clearfix">
            
<nav class="sunken-menu repo-nav js-repo-nav js-sidenav-container-pjax js-octicon-loaders"
     role="navigation"
     data-pjax="#js-repo-pjax-container"
     data-issue-count-url="/dgytdhy/dgytdhy.github.com/issues/counts">
  <ul class="sunken-menu-group">
    <li class="tooltipped tooltipped-w" aria-label="Code">
      <a href="/dgytdhy/dgytdhy.github.com" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /dgytdhy/dgytdhy.github.com">
        <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>

      <li class="tooltipped tooltipped-w" aria-label="Issues">
        <a href="/dgytdhy/dgytdhy.github.com/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /dgytdhy/dgytdhy.github.com/issues">
          <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
          <span class="js-issue-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

    <li class="tooltipped tooltipped-w" aria-label="Pull Requests">
      <a href="/dgytdhy/dgytdhy.github.com/pulls" aria-label="Pull Requests" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g p" data-selected-links="repo_pulls /dgytdhy/dgytdhy.github.com/pulls">
          <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull Requests</span>
          <span class="js-pull-replace-counter"></span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>


      <li class="tooltipped tooltipped-w" aria-label="Wiki">
        <a href="/dgytdhy/dgytdhy.github.com/wiki" aria-label="Wiki" class="js-selected-navigation-item sunken-menu-item" data-hotkey="g w" data-selected-links="repo_wiki /dgytdhy/dgytdhy.github.com/wiki">
          <span class="octicon octicon-book"></span> <span class="full-word">Wiki</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
  </ul>
  <div class="sunken-menu-separator"></div>
  <ul class="sunken-menu-group">

    <li class="tooltipped tooltipped-w" aria-label="Pulse">
      <a href="/dgytdhy/dgytdhy.github.com/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-selected-links="pulse /dgytdhy/dgytdhy.github.com/pulse">
        <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>

    <li class="tooltipped tooltipped-w" aria-label="Graphs">
      <a href="/dgytdhy/dgytdhy.github.com/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-selected-links="repo_graphs repo_contributors /dgytdhy/dgytdhy.github.com/graphs">
        <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
        <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>    </li>
  </ul>


    <div class="sunken-menu-separator"></div>
    <ul class="sunken-menu-group">
      <li class="tooltipped tooltipped-w" aria-label="Settings">
        <a href="/dgytdhy/dgytdhy.github.com/settings" aria-label="Settings" class="js-selected-navigation-item sunken-menu-item" data-selected-links="repo_settings /dgytdhy/dgytdhy.github.com/settings">
          <span class="octicon octicon-tools"></span> <span class="full-word">Settings</span>
          <img alt="" class="mini-loader" height="16" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
    </ul>
</nav>

              <div class="only-with-full-nav">
                
  
<div class="clone-url "
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><span class="text-emphasized">HTTPS</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/dgytdhy/dgytdhy.github.com.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="clone-url open"
  data-protocol-type="ssh"
  data-url="/users/set_protocol?protocol_selector=ssh&amp;protocol_type=clone">
  <h3><span class="text-emphasized">SSH</span> clone URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="git@github.com:dgytdhy/dgytdhy.github.com.git" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>

  
<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><span class="text-emphasized">Subversion</span> checkout URL</h3>
  <div class="input-group js-zeroclipboard-container">
    <input type="text" class="input-mini input-monospace js-url-field js-zeroclipboard-target"
           value="https://github.com/dgytdhy/dgytdhy.github.com" readonly="readonly">
    <span class="input-group-button">
      <button aria-label="Copy to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
    </span>
  </div>
</div>



<p class="clone-options">You can clone with
  <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>, <a href="#" class="js-clone-selector" data-protocol="ssh">SSH</a>, or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <a href="https://help.github.com/articles/which-remote-url-should-i-use" class="help tooltipped tooltipped-n" aria-label="Get help on which URL is right for you.">
    <span class="octicon octicon-question"></span>
  </a>
</p>


  <a href="github-windows://openRepo/https://github.com/dgytdhy/dgytdhy.github.com" class="minibutton sidebar-button" title="Save dgytdhy/dgytdhy.github.com to your computer and use it in GitHub Desktop." aria-label="Save dgytdhy/dgytdhy.github.com to your computer and use it in GitHub Desktop.">
    <span class="octicon octicon-device-desktop"></span>
    Clone in Desktop
  </a>

                <a href="/dgytdhy/dgytdhy.github.com/archive/master.zip"
                   class="minibutton sidebar-button"
                   aria-label="Download the contents of dgytdhy/dgytdhy.github.com as a zip file"
                   title="Download the contents of dgytdhy/dgytdhy.github.com as a zip file"
                   rel="nofollow">
                  <span class="octicon octicon-cloud-download"></span>
                  Download ZIP
                </a>
              </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>
          

<a href="/dgytdhy/dgytdhy.github.com/blob/dcfc5d7c0d3fb1e701f06232f10537f7784a094f/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md" class="hidden js-permalink-shortcut" data-hotkey="y">Permalink</a>

<!-- blob contrib key: blob_contributors:v21:0ac9a4d09c0fe03132ccb8a2fefcaa7a -->

<div class="file-navigation js-zeroclipboard-container">
  
<div class="select-menu js-menu-container js-select-menu left">
  <span class="minibutton select-menu-button js-menu-target css-truncate" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    title="master"
    role="button" aria-label="Switch branches or tags" tabindex="0" aria-haspopup="true">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button css-truncate-target">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax aria-hidden="true">

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-x js-menu-close" role="button" aria-label="Close"></span>
      </div> <!-- /.select-menu-header -->

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Find or create a branch…" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Find or create a branch…">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div><!-- /.select-menu-tabs -->
      </div><!-- /.select-menu-filters -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/dgytdhy/dgytdhy.github.com/blob/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md"
                 data-name="master"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="master">master</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/dgytdhy/dgytdhy.github.com/blob/source/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md"
                 data-name="source"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text css-truncate-target"
                 title="source">source</a>
            </div> <!-- /.select-menu-item -->
        </div>

          <form accept-charset="UTF-8" action="/dgytdhy/dgytdhy.github.com/branches" class="js-create-branch select-menu-item select-menu-new-item-form js-navigation-item js-new-item-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="nSfT6QbQpAA8OV11Gx8Joi1RIXhUhmWOKwEa5umCswUui7OpZqvQeZLJOhvTL4g/E2PQPVEBssHfHRYpSZr4TA==" /></div>
            <span class="octicon octicon-git-branch select-menu-item-icon"></span>
            <div class="select-menu-item-text">
              <h4>Create branch: <span class="js-new-item-name"></span></h4>
              <span class="description">from ‘master’</span>
            </div>
            <input type="hidden" name="name" id="name" class="js-new-item-value">
            <input type="hidden" name="branch" id="branch" value="master">
            <input type="hidden" name="path" id="path" value="_posts/2015-01-05-慕课网学习笔记——Bower的使用实践（1）.md">
          </form> <!-- /.select-menu-item -->

      </div> <!-- /.select-menu-list -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

    </div> <!-- /.select-menu-modal -->
  </div> <!-- /.select-menu-modal-holder -->
</div> <!-- /.select-menu -->

  <div class="button-group right">
    <a href="/dgytdhy/dgytdhy.github.com/find/master"
          class="js-show-file-finder minibutton empty-icon tooltipped tooltipped-s"
          data-pjax
          data-hotkey="t"
          aria-label="Quickly jump between files">
      <span class="octicon octicon-list-unordered"></span>
    </a>
    <button aria-label="Copy file path to clipboard" class="js-zeroclipboard minibutton zeroclipboard-button" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>
  </div>

  <div class="breadcrumb js-zeroclipboard-target">
    <span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/dgytdhy/dgytdhy.github.com" class="" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">dgytdhy.github.com</span></a></span></span><span class="separator">/</span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/dgytdhy/dgytdhy.github.com/tree/master/_posts" class="" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">_posts</span></a></span><span class="separator">/</span><strong class="final-path">2015-01-05-慕课网学习笔记——Bower的使用实践（1）.md</strong>
  </div>
</div>


  <div class="commit file-history-tease">
    <div class="file-history-tease-header">
        <img alt="Desgard_Duan" class="avatar" data-user="7804535" height="24" src="https://avatars0.githubusercontent.com/u/7804535?v=3&amp;s=48" width="24" />
        <span class="author"><a href="/dgytdhy" rel="author">dgytdhy</a></span>
        <time datetime="2015-01-28T07:49:26Z" is="relative-time">Jan 28, 2015</time>
        <div class="commit-title">
            <a href="/dgytdhy/dgytdhy.github.com/commit/0ddf3fba043d2b8caf9027766100ab9cf7bb063c" class="message" data-pjax="true" title="aa">aa</a>
        </div>
    </div>

    <div class="participation">
      <p class="quickstat">
        <a href="#blob_contributors_box" rel="facebox">
          <strong>1</strong>
           contributor
        </a>
      </p>
      
    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list">
          <li class="facebox-user-list-item">
            <img alt="Desgard_Duan" data-user="7804535" height="24" src="https://avatars0.githubusercontent.com/u/7804535?v=3&amp;s=48" width="24" />
            <a href="/dgytdhy">dgytdhy</a>
          </li>
      </ul>
    </div>
  </div>

<div class="file-box">
  <div class="file">
    <div class="meta clearfix">
      <div class="info file-name">
          <span>42 lines (28 sloc)</span>
          <span class="meta-divider"></span>
        <span>0.892 kb</span>
      </div>
      <div class="actions">
        <div class="button-group">
          <a href="/dgytdhy/dgytdhy.github.com/raw/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md" class="minibutton " id="raw-url">Raw</a>
            <a href="/dgytdhy/dgytdhy.github.com/blame/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md" class="minibutton js-update-url-with-hash">Blame</a>
          <a href="/dgytdhy/dgytdhy.github.com/commits/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md" class="minibutton " rel="nofollow">History</a>
        </div><!-- /.button-group -->

          <a class="octicon-button tooltipped tooltipped-nw"
             href="github-windows://openRepo/https://github.com/dgytdhy/dgytdhy.github.com?branch=master&amp;filepath=_posts%2F2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md" aria-label="Open this file in GitHub for Windows">
              <span class="octicon octicon-device-desktop"></span>
          </a>

              <a class="octicon-button js-update-url-with-hash"
                 href="/dgytdhy/dgytdhy.github.com/edit/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md"
                 aria-label="Edit this file"
                 data-method="post" rel="nofollow" data-hotkey="e"><span class="octicon octicon-pencil"></span></a>

            <a class="octicon-button danger"
               href="/dgytdhy/dgytdhy.github.com/delete/master/_posts/2015-01-05-%E6%85%95%E8%AF%BE%E7%BD%91%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%E2%80%94%E2%80%94Bower%E7%9A%84%E4%BD%BF%E7%94%A8%E5%AE%9E%E8%B7%B5%EF%BC%881%EF%BC%89.md"
               aria-label="Delete this file"
               data-method="post" data-test-id="delete-blob-file" rel="nofollow">
          <span class="octicon octicon-trashcan"></span>
        </a>
      </div><!-- /.actions -->
    </div>
    
  <div id="readme" class="blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="mainContentOfPage"><table data-table-type="yaml-metadata">
  <thead>
  <tr>
  <th>layout</th>

  <th>titile</th>

  <th>author</th>

  <th>category</th>

  <th>tag</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td><div>post</div></td>

  <td><div>慕课网学习笔记——Bower的使用实践（1）</div></td>

  <td><div>SooHu</div></td>

  <td><div>学习笔记</div></td>

  <td><div><table>
  <tbody>
  <tr>
  <td><div>imooc</div></td>

  <td><div>Bower</div></td>
  </tr>
  </tbody>
</table></div></td>
  </tr>
  </tbody>
</table><h3>
<a id="user-content-bower" class="anchor" href="#bower" aria-hidden="true"><span class="octicon octicon-link"></span></a>Bower</h3>

<p>官方定义：A package manager for the web</p>

<p>web包管理器</p>

<h5>
<a id="user-content-1-bower的安装" class="anchor" href="#1-bower%E7%9A%84%E5%AE%89%E8%A3%85" aria-hidden="true"><span class="octicon octicon-link"></span></a>1. Bower的安装</h5>

<p><code>npm install -g bower</code>
[]()</p>

<h5>
<a id="user-content-2-bower实际使用安装包" class="anchor" href="#2-bower%E5%AE%9E%E9%99%85%E4%BD%BF%E7%94%A8%E5%AE%89%E8%A3%85%E5%8C%85" aria-hidden="true"><span class="octicon octicon-link"></span></a>2. Bower实际使用安装包</h5>

<ol class="task-list">
<li>
<p>直接安装包</p>

<p><code>bower install jquery</code>
bower会去它的注册库里查找jquery，然后去github里下载</p>
</li>
<li>
<p>比较小众的包下载安装，可以使用github短语或者github地址</p>

<p><code>bower install jquery/jquery</code></p>

<p><code>bower install git@github.com:jquery/jquery.git</code></p>
</li>
<li>
<p>要安装的包没有在github上，可以使用url安装</p>

<p><code>bower install url</code></p>
</li>
</ol>

<h5>
<a id="user-content-3-bower包搜索" class="anchor" href="#3-bower%E5%8C%85%E6%90%9C%E7%B4%A2" aria-hidden="true"><span class="octicon octicon-link"></span></a>3. Bower包搜索</h5>

<p>bower官网有一个bower package search进行包搜索</p>

<h5>
<a id="user-content-4-bower的两个配置文件" class="anchor" href="#4-bower%E7%9A%84%E4%B8%A4%E4%B8%AA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6" aria-hidden="true"><span class="octicon octicon-link"></span></a>4. Bower的两个配置文件</h5>

<p>bower配置文件如何生成</p>

<p>在项目目录上输入命令：<code>bower init</code>
然后按照要求进行选择。</p>
</article>
  </div>

  </div>
</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <form accept-charset="UTF-8" class="js-jump-to-line-form">
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" autofocus>
    <button type="submit" class="button">Go</button>
  </form>
</div>

        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer" role="contentinfo">
    <ul class="site-footer-links right">
      <li><a href="https://status.github.com/">Status</a></li>
      <li><a href="https://developer.github.com">API</a></li>
      <li><a href="http://training.github.com">Training</a></li>
      <li><a href="http://shop.github.com">Shop</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>

    </ul>

    <a href="/" aria-label="Homepage">
      <span class="mega-octicon octicon-mark-github" title="GitHub"></span>
    </a>

    <ul class="site-footer-links">
      <li>&copy; 2015 <span title="0.05072s from github-fe129-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="/site/terms">Terms</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
  </div><!-- /.site-footer -->
</div><!-- /.container -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-suggester-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="fullscreen-contents js-fullscreen-contents" placeholder=""></textarea>
      <div class="suggester-container">
        <div class="suggester fullscreen-suggester js-suggester js-navigation-container"></div>
      </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped tooltipped-w" aria-label="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped tooltipped-w"
      aria-label="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-x flash-close js-ajax-error-dismiss" aria-label="Dismiss error"></a>
      Something went wrong with that request. Please try again.
    </div>


      <script crossorigin="anonymous" src="https://assets-cdn.github.com/assets/frameworks-af95b05cb14b7a29b0457c26b4a1d24151f4a47842c8e74bd556622f347b9d3d.js" type="text/javascript"></script>
      <script async="async" crossorigin="anonymous" src="https://assets-cdn.github.com/assets/github-6fb290feb68c5887ec2c3a665de6ad3c245fca991bd8114ccedcfae4cd7314f1.js" type="text/javascript"></script>
      
      
  </body>
</html>

