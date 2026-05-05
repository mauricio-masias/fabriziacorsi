<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Fabrizia Corsi — London-based DJ &amp; Producer. 20+ years of House, Tech House, Tribal House and more. Available for bookings worldwide.">
    <meta name="theme-color" content="#080808">
    <title>Fabrizia Corsi — DJ / Producer</title>

    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

    <!-- Font preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Righteous&display=swap" rel="stylesheet">

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ config('app.gtm_id') }}');</script>
    <!-- End Google Tag Manager -->

    <script>
        window.__env = {
            apiUrl: "{{ config('app.api_url') }}",
            gtmId: "{{ config('app.gtm_id') }}"
        };
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ config('app.gtm_id') }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <div id="app"></div>
</body>
</html>
