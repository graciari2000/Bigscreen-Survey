<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class User extends Model
{
    protected $fillable = ['email', 'response_token'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($user) {
            $user->response_token = Str::uuid();
        });
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}