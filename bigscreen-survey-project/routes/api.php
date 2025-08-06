<?php

use App\Http\Controllers\Api\SurveyController;
use App\Http\Controllers\Api\ResponseController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/survey', [SurveyController::class, 'index']);
Route::post('/survey', [SurveyController::class, 'store']);
Route::get('/responses/{token}', [ResponseController::class, 'show'])->name('responses.show');
Route::post('/admin/login', [AdminController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard']);
    Route::get('/admin/questions', [AdminController::class, 'questions']);
    Route::get('/admin/responses', [AdminController::class, 'responses']);
    Route::post('/admin/logout', [AdminController::class, 'logout']);
});