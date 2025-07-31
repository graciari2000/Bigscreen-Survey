<?php
Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (!file_exists($path)) {
        abort(404, 'Frontend assets not found. Please build your React application.');
    }
    return file_get_contents($path);
})->where('any', '^(?!api).*'); // Exclude 'api' from being matched