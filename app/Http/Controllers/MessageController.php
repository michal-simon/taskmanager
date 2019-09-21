<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller {

    public function getCustomers() {
        $arrCustomers[0] = [
            'name' => "Michael Hampton",
            'customer_id' => 1,
            'avatar' => "https://mdbootstrap.com/img/Photos/Avatars/img(3).jpg",
            'message' => "Hello, Are you there?",
            'when' => "Yesterday",
            'toRespond' => 0,
            'seen' => false,
            'active' => false
        ];

        return response()->json($arrCustomers);
    }

    public function index() {
        $arrMessages[0] = [
            'author' => "Brad Pitt",
            'avatar' => "https://mdbootstrap.com/img/Photos/Avatars/avatar-6",
            'when' => "12 mins ago",
            'message' => 'Test Mike'
        ];
        
         $arrMessages[1] = [
            'author' => "Jhoanna Hampton",
            'avatar' => "https://mdbootstrap.com/img/Photos/Avatars/avatar-6",
            'when' => "12 mins ago",
            'message' => 'Test Jhoanna'
        ];

        return response()->json($arrMessages);
    }
    
    /**
     * 
     * @param \App\Http\Controllers\Request $request
     */
    public function store(Request $request) {
        echo '<pre>';
        print_r($request->all());
        die;
    }

}
