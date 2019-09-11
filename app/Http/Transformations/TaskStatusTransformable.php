<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class TaskStatusResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'icon'          => $this->icon,
            'is_active'     => $this->is_active,
            'created_at'    => $this->created_at
        ];
    }
}
