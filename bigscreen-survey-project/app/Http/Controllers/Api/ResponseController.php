<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Question;

/**
 * Handles displaying user responses via a secure token.
 */
class ResponseController extends Controller
{
    /**
     * Display user responses by response token.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($token)
    {
        // Find user by response token or fail
        $user = User::where('response_token', $token)->firstOrFail();

        // Fetch questions with associated user responses
        $questions = Question::with(['responses' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])->orderBy('number')->get();

        return response()->json([
            'user' => $user,
            'questions' => $questions,
        ]);
    }
}