<?php

namespace App\Http\Controllers;

use App\Requests\LoginRequest;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller {

    use AuthenticatesUsers;

    public function doLogin(LoginRequest $request) {

        $this->validateLogin($request);
                
        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            return $this->sendLockoutResponse($request);
        }
        
        $details = $request->only('email', 'password');
        $details['is_active'] = 1;
        if (auth()->guard('user')->attempt($details)) {
            
            $this->sendLoginResponse($request);
           
            $user = auth()->guard('user')->user();
            
            return $user->toJson();
        }
        // If the login attempt was unsuccessful we will increment the number of attempts
        // to login and redirect the user back to the login form. Of course, when this
        // user surpasses their maximum number of attempts they will get locked out.
        $this->incrementLoginAttempts($request);
        return $this->sendFailedLoginResponse($request);
    }

    public function showLogin() {
        // show the form
        return View::make('login');
    }

    public function doLogout() {
        Auth::logout(); // log the user out of our application
        return Redirect::to('login'); // redirect the user to the login screen
    }

}
