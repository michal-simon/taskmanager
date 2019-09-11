<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class ProjectResource extends Resource
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
            'created_by'    => $this->created_by,
            'is_active'     => $this->is_active,
            'created_at'    => Carbon::parse($this->created_at)->toDayDateTimeString(),
        ];
    }
}
