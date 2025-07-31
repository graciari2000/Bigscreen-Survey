<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Response;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Handles admin-related API endpoints, including authentication and dashboard data.
 */
class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['login']);
    }

    /**
     * Authenticate admin and issue a Sanctum token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::guard('admin')->attempt($credentials)) {
            $admin = Auth::guard('admin')->user();
            $token = $admin->createToken('admin-token', ['*'])->plainTextToken;
            return response()->json(['token' => $token], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    /**
     * Display dashboard data with chart statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard()
    {
        // VR Headset Used (Question 6)
        $headsetData = Response::whereHas('question', function ($query) {
            $query->where('number', 6);
        })->groupBy('answer')->selectRaw('answer, count(*) as count')->pluck('count', 'answer')->toArray();

        // VR Content Store (Question 7)
        $storeData = Response::whereHas('question', function ($query) {
            $query->where('number', 7);
        })->groupBy('answer')->selectRaw('answer, count(*) as count')->pluck('count', 'answer')->toArray();

        // Primary Use of Bigscreen (Question 10)
        $usageData = Response::whereHas('question', function ($query) {
            $query->where('number', 10);
        })->groupBy('answer')->selectRaw('answer, count(*) as count')->pluck('count', 'answer')->toArray();

        // Quality Ratings (Questions 11–15)
        $qualityData = Response::whereHas('question', function ($query) {
            $query->whereIn('number', [11, 12, 13, 14, 15]);
        })->groupBy('question_id')->selectRaw('question_id, avg(answer) as avg')->pluck('avg', 'question_id')->toArray();

        return response()->json([
            'headsetData' => $headsetData,
            'storeData' => $storeData,
            'usageData' => $usageData,
            'qualityData' => $qualityData,
        ]);
    }

    /**
     * Display all survey questions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function questions()
    {
        $questions = Question::orderBy('number')->get();
        return response()->json($questions);
    }

    /**
     * Display all user responses.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function responses()
    {
        $users = User::with('responses.question')->get();
        return response()->json($users);
    }

    /**
     * Log out admin by revoking the current token.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out'], 200);
    }
}