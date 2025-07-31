<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['number', 'body', 'type', 'options'];

    protected $casts = [
        'options' => 'array',
    ];

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}