<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class TaskResource extends Resource
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
            'content'       => $this->content,
            'task_color'    => $this->task_color,
            'contributors'  => $this->contributors,
            'project_id'    => $this->project_id,
            'due_date'      => $this->due_date,
            'created_at'    => Carbon::parse($this->created_at)->toDayDateTimeString(),
        ];
    }
}
