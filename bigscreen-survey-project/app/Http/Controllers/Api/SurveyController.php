<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SurveyRequest;
use App\Models\User;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SurveyController extends Controller
{
    /**
     * Get all survey questions.
     */
    public function index()
    {
        try {
            $questions = Question::orderBy('number')->get();
            return response()->json($questions);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch questions',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store survey responses.
     */
    public function store(SurveyRequest $request)
    {
        try {
            // The request is already validated by SurveyRequest
            $validated = $request->validated();
            
            $user = User::create([
                'email' => $validated['email'], 
                'response_token' => Str::uuid()
            ]);
            
            foreach ($validated['responses'] as $questionId => $response) {
                Response::create([
                    'user_id' => $user->id,
                    'question_id' => $questionId,
                    'answer' => $response['answer'],
                ]);
            }

            return response()->json([
                'message' => 'Thank you for your participation!',
                'response_url' => url("/responses/{$user->response_token}"),
            ]);

        } catch (ValidationException $e) {
            // Return validation errors as JSON
            return response()->json([
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to save responses',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}