<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SurveyRequest;
use App\Models\User;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Support\Str;

class SurveyController extends Controller
{
    /**
     * Get all survey questions.
     */
    public function index()
    {
        $questions = Question::orderBy('number')->get();
        return response()->json($questions);
    }

    /**
     * Store survey responses.
     */
    public function store(SurveyRequest $request)
    {
        $user = User::create(['email' => $request->email, 'response_token' => Str::uuid()]);
        foreach ($request->responses as $questionId => $response) {
            Response::create([
                'user_id' => $user->id,
                'question_id' => $questionId,
                'answer' => $response['answer'],
            ]);
        }

        return response()->json([
            'message' => 'Thank you for your participation!',
            'response_url' => route('responses.show', $user->response_token),
        ]);
    }
}