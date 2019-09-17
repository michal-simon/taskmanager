<?php

use Illuminate\Http\Request;

 // routes/api.php

Route::get('projects', 'ProjectController@index');
Route::get('projects', 'ProjectController@index');
Route::post('projects', 'ProjectController@store');
Route::get('users/dashboard', 'UserController@dashboard');
Route::get('customers/dashboard', 'CustomerController@dashboard');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@markAsCompleted');
Route::post('tasks', 'TaskController@store');
Route::get('tasks/getTasksForProject/{project_id}', 'TaskController@getTasksForProject');
//Route::put('tasks/{task}', 'TaskController@markAsCompleted');
Route::delete('tasks/{task}', 'TaskController@destroy');
Route::delete('users/{user_id}', 'UserController@destroy');
Route::post('users', 'UserController@store');
Route::get('status/{task_type}', 'TaskStatusController@index');
Route::put('users/{user_id}', 'UserController@update');
Route::get('users', 'UserController@index');
Route::post('uploads', 'UploadController@store');
Route::post('comments', 'CommentController@store');
Route::get('uploads/{task_id}', 'UploadController@index');
Route::get('comments/{task_id}', 'CommentController@index');
Route::put('tasks/{task_id}', 'TaskController@update');
Route::get('leads', 'TaskController@getLeads');
Route::put('tasks/status/{task_id}', 'TaskController@updateStatus');
Route::get('roles', 'RoleController@index');
Route::post('invoice', 'InvoiceController@store');
Route::get('invoice', 'InvoiceController@index');
Route::get('invoice/{invoice_id}', 'InvoiceController@show');
Route::delete('invoice/line/{line_id}', 'InvoiceController@destroyLine');
Route::put('invoice/line/{line_id}', 'InvoiceController@updateLine');
Route::put('invoice/{invoice_id}', 'InvoiceController@update');
Route::get('customers', 'CustomerController@index');
Route::get('customers/{customer_id}', 'CustomerController@show');
Route::put('customers/{customer_id}', 'CustomerController@update');
Route::post('customers', 'CustomerController@store');
Route::delete('customers/{customer_id}', 'CustomerController@destroy');