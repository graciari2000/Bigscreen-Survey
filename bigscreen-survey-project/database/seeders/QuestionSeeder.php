<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run()
    {
        $questions = [
            ['number' => 1, 'body' => 'Your age', 'type' => 'B'],
            ['number' => 2, 'body' => 'Your gender', 'type' => 'A', 'options' => json_encode(['Male', 'Female', 'Prefer not to say'])],
            ['number' => 3, 'body' => 'Number of people in your household (adults & children)', 'type' => 'C'],
            ['number' => 4, 'body' => 'Your profession', 'type' => 'B'],
            ['number' => 5, 'body' => 'Which brand of VR headset do you use?', 'type' => 'A', 'options' => json_encode(['Oculus Quest', 'Oculus Rift/s', 'HTC Vive', 'Windows Mixed Reality', 'Valve Index'])],
            ['number' => 6, 'body' => 'Where do you buy VR content?', 'type' => 'A', 'options' => json_encode(['SteamVR', 'Oculus Store', 'Viveport', 'Windows Store'])],
            ['number' => 7, 'body' => 'Which headset are you planning to buy in the near future?', 'type' => 'A', 'options' => json_encode(['Oculus Quest', 'Oculus Go', 'HTC Vive Pro', 'PSVR', 'Other', 'None'])],
            ['number' => 8, 'body' => 'How many people in your household use your VR headset for Bigscreen?', 'type' => 'C'],
            ['number' => 9, 'body' => 'You primarily use Bigscreen for:', 'type' => 'A', 'options' => json_encode(['Watching TV live', 'Watching movies', 'Working', 'Solo gaming', 'Team gaming'])],
            ['number' => 10, 'body' => 'How would you rate the image quality on Bigscreen?', 'type' => 'C'],
            ['number' => 11, 'body' => 'How would you rate the ease of use of Bigscreen’s interface?', 'type' => 'C'],
            ['number' => 12, 'body' => 'How would you rate Bigscreen’s network connection?', 'type' => 'C'],
            ['number' => 13, 'body' => 'How would you rate the quality of 3D graphics in Bigscreen?', 'type' => 'C'],
            ['number' => 14, 'body' => 'How would you rate the audio quality in Bigscreen?', 'type' => 'C'],
            ['number' => 15, 'body' => 'Would you like more precise notifications during your Bigscreen sessions?', 'type' => 'A', 'options' => json_encode(['Yes', 'No'])],
            ['number' => 16, 'body' => 'Would you like to invite a friend to join your session via their smartphone?', 'type' => 'A', 'options' => json_encode(['Yes', 'No'])],
            ['number' => 17, 'body' => 'Would you like to record TV shows to watch later?', 'type' => 'A', 'options' => json_encode(['Yes', 'No'])],
            ['number' => 18, 'body' => 'Would you like to play exclusive games on Bigscreen?', 'type' => 'A', 'options' => json_encode(['Yes', 'No'])],
            ['number' => 19, 'body' => 'What new feature should exist on Bigscreen?', 'type' => 'B'],
            ['number' => 20, 'body' => 'Any other comments or suggestions?', 'type' => 'B'],
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}