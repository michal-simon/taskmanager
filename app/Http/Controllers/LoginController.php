<?php

namespace App\Http\Controllers;

use App\Requests\LoginRequest;
use Illuminate\Http\Request;
use App\User;
use JWTAuth;
use JWTAuthException;

class LoginController extends Controller {

    private function getToken($email, $password) {
        $token = null;
        //$credentials = $request->only('email', 'password');
        try {
            if (!$token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
                return response()->json([
                            'response' => 'error',
                            'message' => 'Password or email is invalid',
                            'token' => $token
                ]);
            }
        } catch (JWTAuthException $e) {
            return response()->json([
                        'response' => 'error',
                        'message' => 'Token creation failed',
            ]);
        }
        return $token;
    }

    public function doLogin(LoginRequest $request) {

        $user = \App\User::where('email', trim($request->email))->get()->first();
        
        if ($user && \Hash::check($request->password, $user->password)) { // The passwords match...
            $token = self::getToken($request->email, $request->password);
            $user->auth_token = $token;
            $user->save();
            $response = ['success' => true, 'data' => ['id' => $user->id, 'auth_token' => $user->auth_token, 'name' => $user->name, 'email' => $user->email]];
        } else
            $response = ['success' => false, 'data' => 'Record doesnt exists'];

        return response()->json($response, 201);
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
