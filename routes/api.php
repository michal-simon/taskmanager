<?php

use Illuminate\Http\Request;

 // routes/api.php

Route::get('projects', 'ProjectController@index');
Route::get('projects', 'ProjectController@index');
Route::post('projects', 'ProjectController@store');
Route::get('users/dashboard', 'UserController@dashboard');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@markAsCompleted');
Route::post('tasks', 'TaskController@store');
Route::get('tasks/getTasksForProject/{project_id}', 'TaskController@getTasksForProject');
//Route::put('tasks/{task}', 'TaskController@markAsCompleted');
Route::delete('tasks/{task}', 'TaskController@destroy');
Route::post('users', 'UserController@store');
Route::get('status', 'TaskStatusController@index');
Route::get('users', 'UserController@index');
Route::post('uploads', 'UploadController@store');
Route::post('comments', 'CommentController@store');
Route::get('uploads/{task_id}', 'UploadController@index');
Route::get('comments/{task_id}', 'CommentController@index');
Route::put('tasks/{task_id}', 'TaskController@update');
Route::post('invoice', 'InvoiceController@store');
Route::get('invoice', 'InvoiceController@index');
Route::get('invoice/{invoice_id}', 'InvoiceController@show');
Route::delete('invoice/line/{line_id}', 'InvoiceController@destroyLine');




