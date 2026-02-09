export interface Database {
  public: {
    Tables: {
      schedule: {
        Row: {
          id: string;
          day_of_week: string;
          time_slot: string;
          subject: string;
          teacher: string;
          room: string;
          group_name: string;
          lesson_type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['schedule']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['schedule']['Insert']>;
      };
      useful_links: {
        Row: {
          id: string;
          title: string;
          url: string;
          category: string;
          description: string;
          icon: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['useful_links']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['useful_links']['Insert']>;
      };
    };
  };
}
