<?php
class PasswordReset extends Model
{
    protected $fillable = [
        'email', 
        'token'
    ];
}
